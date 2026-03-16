-- Create processed_images table
CREATE TABLE IF NOT EXISTS public.processed_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Original image info
  original_filename TEXT NOT NULL,
  original_size_bytes INTEGER NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_format TEXT CHECK (original_format IN ('jpg', 'png', 'webp', 'jpeg')),
  
  -- Processed image info
  processed_url TEXT,
  processed_size_bytes INTEGER,
  processed_width INTEGER DEFAULT 2000,
  processed_height INTEGER DEFAULT 2000,
  processed_format TEXT DEFAULT 'jpg',
  
  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  
  -- Compliance check results
  compliance_check JSONB,
  
  -- Processing time
  processing_time_ms INTEGER,
  
  -- AI service info
  ai_provider TEXT DEFAULT 'replicate',
  ai_cost_usd DECIMAL(10, 6),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes
CREATE INDEX idx_processed_images_user ON public.processed_images(user_id);
CREATE INDEX idx_processed_images_status ON public.processed_images(status);
CREATE INDEX idx_processed_images_created ON public.processed_images(created_at DESC);
CREATE INDEX idx_processed_images_expires ON public.processed_images(expires_at);

-- Enable RLS
ALTER TABLE public.processed_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own images"
  ON public.processed_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON public.processed_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);
