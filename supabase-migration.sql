-- ================================================
-- Supabase saved_carts 테이블에 예약 필드 추가
-- ================================================
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요
-- (Supabase Dashboard > SQL Editor > New Query)

-- 1. delivery_date 컬럼 추가 (배송 예정일)
ALTER TABLE saved_carts
ADD COLUMN IF NOT EXISTS delivery_date DATE;

-- 2. status 컬럼 추가 (상태: pending/scheduled/preparing/hold/urgent)
ALTER TABLE saved_carts
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 3. priority 컬럼 추가 (우선순위: normal/high)
ALTER TABLE saved_carts
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';

-- 4. memo 컬럼 추가 (메모)
ALTER TABLE saved_carts
ADD COLUMN IF NOT EXISTS memo TEXT;

-- 5. reminded 컬럼 추가 (알림 전송 여부)
ALTER TABLE saved_carts
ADD COLUMN IF NOT EXISTS reminded BOOLEAN DEFAULT false;

-- 6. 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_saved_carts_delivery_date ON saved_carts(delivery_date);
CREATE INDEX IF NOT EXISTS idx_saved_carts_status ON saved_carts(status);
CREATE INDEX IF NOT EXISTS idx_saved_carts_priority ON saved_carts(priority);

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ saved_carts 테이블 업데이트 완료!';
  RAISE NOTICE '추가된 컬럼:';
  RAISE NOTICE '  - delivery_date (DATE): 배송 예정일';
  RAISE NOTICE '  - status (TEXT): 상태 (pending/scheduled/preparing/hold/urgent)';
  RAISE NOTICE '  - priority (TEXT): 우선순위 (normal/high)';
  RAISE NOTICE '  - memo (TEXT): 메모';
  RAISE NOTICE '  - reminded (BOOLEAN): 알림 전송 여부';
END $$;
