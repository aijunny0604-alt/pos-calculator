# 🔧 Supabase 장바구니 저장 기능 설정 가이드

## 📋 개요

장바구니 저장 기능이 다른 사용자들과 실시간으로 공유되도록 Supabase 데이터베이스에 연동되었습니다.

현재 코드는 **자동 폴백 시스템**이 적용되어 있어:
- Supabase 테이블에 예약 필드가 있으면 → **Supabase에 모든 데이터 저장** (권장)
- Supabase 테이블에 예약 필드가 없으면 → **기본 필드만 Supabase + 예약 필드는 localStorage**

## 🎯 권장 설정: Supabase 완전 연동

다른 사용자들과 **상태, 배송일, 우선순위, 메모**를 모두 공유하려면 Supabase 테이블에 컬럼을 추가해야 합니다.

### 1️⃣ Supabase 대시보드 접속

1. [https://supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭

### 2️⃣ 마이그레이션 스크립트 실행

1. **New Query** 버튼 클릭
2. `supabase-migration.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl+Enter)

### 3️⃣ 확인

테이블 구조 확인:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'saved_carts';
```

다음 컬럼들이 보여야 합니다:
- `id`
- `name`
- `items`
- `total`
- `price_type`
- `date`
- `time`
- `created_at`
- **`delivery_date`** ✨ (새로 추가)
- **`status`** ✨ (새로 추가)
- **`priority`** ✨ (새로 추가)
- **`memo`** ✨ (새로 추가)
- **`reminded`** ✨ (새로 추가)

## 🔍 작동 확인

1. 앱을 새로고침합니다
2. 장바구니에 제품을 추가합니다
3. "장바구니 저장" 버튼 클릭
4. 개발자 도구(F12) > Console 탭 확인:
   - ✅ `Supabase 저장 완료` → **완벽하게 작동**
   - ⚠️ `기본 필드만 저장` → **Supabase 테이블에 컬럼 추가 필요**

## 📊 변경된 기본값

### 배송 예정일
- **변경 전**: 내일 날짜로 자동 설정
- **변경 후**: 오늘 날짜로 자동 설정 ✨

### 상태
- **변경 전**: "예약됨" (scheduled)
- **변경 후**: "작성중" (pending) ✨

## 🔄 데이터 동기화

### Supabase 컬럼이 있을 때 (권장)
```
사용자 A → Supabase → 사용자 B, C, D
          (모든 데이터 실시간 공유)
```

### Supabase 컬럼이 없을 때 (임시 방식)
```
기본 필드 (이름, 제품, 가격) → Supabase → 모든 사용자 공유
예약 필드 (상태, 배송일, 메모) → localStorage → 본인만 보임
```

## 🛠️ 트러블슈팅

### 문제: "기본 필드만 저장" 메시지가 계속 나옴
**원인**: Supabase 테이블에 예약 필드 컬럼이 없음
**해결**: 위의 마이그레이션 스크립트 실행

### 문제: 다른 사용자가 저장한 장바구니의 상태가 안 보임
**원인**: 예약 필드가 localStorage에만 저장됨
**해결**: Supabase 테이블에 컬럼 추가 필요

### 문제: 필터가 작동하지 않음
**원인**: 데이터가 localStorage에만 있어서 다른 사용자 데이터 필터링 불가
**해결**: Supabase 테이블에 컬럼 추가 필요

## 📝 참고 사항

- 기존에 localStorage에 저장된 데이터는 자동으로 마이그레이션되지 않습니다
- Supabase 테이블 업데이트 후 앱을 새로고침하세요
- 주문 이력 시스템과 동일한 방식으로 작동합니다
