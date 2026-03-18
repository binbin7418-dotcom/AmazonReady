import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CREDITS_MAP = {
  'Starter': 500,
  'Pro': 2000,
  'Enterprise': 999999,
};

const AMOUNT_MAP = {
  '19': 500,
  '49': 2000,
  '199': 999999,
};

function mapCredits(tierName, amount) {
  if (tierName && CREDITS_MAP[tierName]) return CREDITS_MAP[tierName];
  const amountInt = String(Math.floor(parseFloat(amount || '0')));
  return AMOUNT_MAP[amountInt] || 0;
}

function mapTier(tierName) {
  const map = { 'Starter': 'starter', 'Pro': 'pro', 'Enterprise': 'enterprise' };
  return map[tierName] || 'starter';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ko-fi 发送 application/x-www-form-urlencoded，data 字段是 JSON 字符串
    const rawData = req.body?.data;
    if (!rawData) return res.status(200).json({ error: 'No data' });

    const payload = JSON.parse(decodeURIComponent(rawData));

    // 验证 token
    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      console.warn('Ko-fi webhook: invalid verification token');
      return res.status(200).json({ error: 'Invalid token' });
    }

    const { kofi_transaction_id, email, tier_name, amount } = payload;

    // 幂等检查
    const { data: existing } = await supabase
      .from('kofi_orders')
      .select('id')
      .eq('kofi_transaction_id', kofi_transaction_id)
      .single();

    if (existing) {
      return res.status(200).json({ status: 'duplicate' });
    }

    const creditsToAdd = mapCredits(tier_name, amount);
    if (creditsToAdd === 0) {
      return res.status(200).json({ status: 'unknown_tier' });
    }

    // 查找用户
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id, credits_balance')
      .eq('email', email)
      .single();

    if (userProfile) {
      // 用户已注册，直接发放
      const newBalance = userProfile.credits_balance === 999999
        ? 999999
        : userProfile.credits_balance + creditsToAdd;

      await supabase
        .from('user_profiles')
        .update({
          credits_balance: newBalance,
          subscription_tier: mapTier(tier_name),
        })
        .eq('email', email);

      await supabase.from('kofi_orders').insert({
        kofi_transaction_id,
        buyer_email: email,
        tier_name,
        amount: parseFloat(amount),
        credits_granted: creditsToAdd,
        user_id: userProfile.id,
        status: 'completed',
        raw_payload: payload,
      });
    } else {
      // 用户未注册，记录 pending
      await supabase.from('kofi_orders').insert({
        kofi_transaction_id,
        buyer_email: email,
        tier_name,
        amount: parseFloat(amount),
        credits_granted: creditsToAdd,
        status: 'pending_registration',
        raw_payload: payload,
      });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Ko-fi webhook error:', error);
    // 始终返回 200，避免 Ko-fi 重试
    return res.status(200).json({ error: 'Internal error' });
  }
}
