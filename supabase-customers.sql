-- ============================================
-- Supabase 거래처 테이블 설정 SQL
-- Supabase > SQL Editor에서 실행하세요
-- ============================================

-- 1. customers 테이블 생성
CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text,
  address text,
  memo text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Row Level Security 활성화
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 3. 모든 작업 허용 정책
CREATE POLICY "Allow all operations on customers" ON customers
  FOR ALL USING (true);

-- 4. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

-- ============================================
-- 실행 후 customers-data.sql 파일도 실행하세요!
-- ============================================
