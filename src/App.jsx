import React, { useState, useMemo, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Search, ShoppingCart, ShoppingBag, Package, Calculator, Trash2, Plus, Minus, X, ChevronDown, ChevronUp, FileText, Copy, Check, Printer, History, List, Save, Eye, Calendar, Clock, ChevronLeft, Cloud, RefreshCw, Users, Receipt, Wifi, WifiOff, Settings, Lock, Upload, Download, Edit3, LogOut, Zap, AlertTriangle, MapPin, Phone, Building, Truck, RotateCcw, Sparkles } from 'lucide-react';

// ==================== SUPABASE 설정 ====================
const SUPABASE_URL = 'https://icqxomltplewrhopafpq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YB9UnUwuMql8hUGHgC0bsg_DhrAxpji';

// Supabase API 호출 함수 (주문 + 제품)
const supabase = {
  // ===== 주문 관련 =====
  async getOrders() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Supabase getOrders error:', error);
      return null;
    }
  },
  
  async saveOrder(order) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(order)
      });
      if (!response.ok) throw new Error('Failed to save order');
      return await response.json();
    } catch (error) {
      console.error('Supabase saveOrder error:', error);
      return null;
    }
  },
  
  async deleteOrder(id) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete order');
      return true;
    } catch (error) {
      console.error('Supabase deleteOrder error:', error);
      return false;
    }
  },

  // ===== 제품 관련 =====
  async getProducts() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?order=category,name`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Supabase getProducts error:', error);
      return null;
    }
  },

  async addProduct(product) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to add product');
      return await response.json();
    } catch (error) {
      console.error('Supabase addProduct error:', error);
      return null;
    }
  },

  async updateProduct(id, product) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('Supabase updateProduct error:', error);
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return true;
    } catch (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
  },

  // ===== 거래처 관련 =====
  async getCustomers() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/customers?order=name`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      console.error('Supabase getCustomers error:', error);
      return null;
    }
  },

  async addCustomer(customer) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(customer)
      });
      if (!response.ok) throw new Error('Failed to add customer');
      const data = await response.json();
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Supabase addCustomer error:', error);
      return null;
    }
  },

  async updateCustomer(id, customer) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(customer)
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return await response.json();
    } catch (error) {
      console.error('Supabase updateCustomer error:', error);
      return null;
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      return true;
    } catch (error) {
      console.error('Supabase deleteCustomer error:', error);
      return false;
    }
  }
};

// 관리자 비밀번호
const ADMIN_PASSWORD = '1234';

// 커스텀 스타일 및 애니메이션
const CustomStyles = () => (
  <style>{`
    /* 물리 기반 부드러운 스크롤 */
    * {
      scroll-behavior: smooth;
      -webkit-tap-highlight-color: transparent; /* 터치 하이라이트 제거 */
    }
    
    html {
      scroll-behavior: smooth;
      overflow-y: scroll;
      overscroll-behavior: smooth;
    }
    
    body {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      cursor: default;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      /* 아이폰 safe area 대응 */
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    /* 입력 필드와 복사 필요한 데이터만 선택 가능 */
    input, textarea, [contenteditable="true"] {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
      /* iOS 줌 방지 */
      font-size: 16px !important;
    }
    
    /* 버튼, 링크에만 pointer 커서 */
    button, a, [role="button"], .cursor-pointer {
      cursor: pointer;
      /* 터치 영역 최소 44px (애플 가이드라인) */
      min-height: 44px;
    }
    
    /* 입력 필드는 text 커서 */
    input, textarea, select {
      cursor: text;
      /* iOS 줌 방지 */
      font-size: 16px !important;
    }
    
    input[type="number"] {
      cursor: text;
    }
    
    /* 모바일 최적화 */
    @media (max-width: 640px) {
      /* 터치 친화적 버튼 크기 */
      button {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* 모달 풀스크린 최적화 */
      .fixed.inset-0 > div {
        max-height: 90vh !important;
        margin: 16px;
      }
      
      /* 폰트 사이즈 조정 */
      .text-xs {
        font-size: 11px !important;
      }
      
      .text-sm {
        font-size: 13px !important;
      }
    }
    
    /* 태블릿 최적화 */
    @media (min-width: 641px) and (max-width: 1024px) {
      /* 터치 친화적 */
      button {
        min-height: 40px;
      }
    }
    
    /* 아이폰 노치 대응 */
    @supports (padding: max(0px)) {
      .fixed.bottom-0 {
        padding-bottom: max(20px, env(safe-area-inset-bottom)) !important;
      }
    }
    
    /* 모든 스크롤 가능 영역에 부드러운 스크롤 적용 */
    [class*="overflow"] {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    
    /* 모달 내부 스크롤 - Lenis 간섭 방지 */
    [data-lenis-prevent] {
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }
    
    /* 모달 오버레이 스크롤 방지 */
    .fixed.inset-0 {
      overscroll-behavior: contain;
    }
    
    /* 모바일 터치 스크롤 강화 */
    .mobile-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
      scroll-behavior: auto;
    }
    
    /* 모바일에서 모달 스크롤 영역 */
    @media (max-width: 768px) {
      .overflow-y-auto {
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
      }
      
      /* 모달 높이 모바일 최적화 */
      .max-h-\\[90vh\\] {
        max-height: 85vh !important;
      }
      
      .max-h-\\[calc\\(90vh-200px\\)\\] {
        max-height: calc(85vh - 180px) !important;
      }
    }
    
    /* 커스텀 스크롤바 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(30, 41, 59, 0.5);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #3b82f6, #8b5cf6);
      border-radius: 10px;
      border: 2px solid rgba(30, 41, 59, 0.5);
      transition: background 0.3s ease;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #60a5fa, #a78bfa);
    }
    
    /* 카테고리 내부 스크롤바 */
    .category-scroll::-webkit-scrollbar {
      width: 6px;
    }
    
    .category-scroll::-webkit-scrollbar-track {
      background: rgba(51, 65, 85, 0.3);
      border-radius: 10px;
    }
    
    .category-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #475569, #64748b);
      border-radius: 10px;
    }
    
    /* 주문 목록 스크롤바 - 에메랄드 */
    .order-scroll::-webkit-scrollbar {
      width: 6px;
    }
    
    .order-scroll::-webkit-scrollbar-track {
      background: rgba(6, 78, 59, 0.3);
      border-radius: 10px;
    }
    
    .order-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #10b981, #14b8a6);
      border-radius: 10px;
    }
    
    /* 부드러운 스크롤 영역 */
    .smooth-scroll {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
    
    /* 애니메이션 정의 */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    /* 애니메이션 클래스 */
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    
    .animate-fade-in-down {
      animation: fadeInDown 0.4s ease-out forwards;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.4s ease-out forwards;
    }
    
    .animate-slide-in-left {
      animation: slideInLeft 0.4s ease-out forwards;
    }
    
    .animate-scale-in {
      animation: scaleIn 0.3s ease-out forwards;
    }
    
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    
    /* 스태거 애니메이션 딜레이 */
    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; }
    .stagger-6 { animation-delay: 0.3s; }
    
    /* 호버 트랜지션 */
    .hover-lift {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    
    /* 버튼 리플 효과 */
    .btn-ripple {
      position: relative;
      overflow: hidden;
    }
    
    .btn-ripple::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease;
    }
    
    .btn-ripple:active::after {
      width: 200px;
      height: 200px;
    }
    
    /* 카드 호버 글로우 */
    .card-glow {
      transition: all 0.3s ease;
    }
    
    .card-glow:hover {
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
    }
    
    /* 그라데이션 텍스트 */
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* 쉬머 로딩 효과 */
    .shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

// 단가표 데이터 - CSV 기반 전체 데이터 (478개 제품)
const priceData = [
  // 모듈 (10개)
  { id: 1, category: '모듈', name: '져스트 G1', wholesale: 700000, retail: 1100000 },
  { id: 2, category: '모듈', name: '져스트 G2', wholesale: 865000, retail: 1500000 },
  { id: 3, category: '모듈', name: '져스트 G1C1', wholesale: 821000, retail: 1361000 },
  { id: 4, category: '모듈', name: '져스트 G2C1', wholesale: 986000, retail: 1761000 },
  { id: 5, category: '모듈', name: '져스트 모듈', wholesale: 440000, retail: 700000 },
  { id: 6, category: '모듈', name: '블로썸', wholesale: 350000, retail: 490000 },
  { id: 7, category: '모듈', name: 'RW 모듈 낱개', wholesale: 460000, retail: 560000 },
  { id: 8, category: '모듈', name: 'RW 모듈 5-10개', wholesale: 330000, retail: 560000 },
  { id: 9, category: '모듈', name: 'RW 모듈 11-20개', wholesale: 270000, retail: 560000 },
  { id: 10, category: '모듈', name: '보펜', wholesale: 242000, retail: 350000 },
  
  // 스피커 (2개)
  { id: 11, category: '져스트 스피커', name: '메인 스피커', wholesale: 250000, retail: 500000 },
  { id: 12, category: '져스트 스피커', name: '고음 스피커', wholesale: 176000, retail: 361000 },
  
  // 배선/부품 (5개)
  { id: 13, category: '배선/부품', name: '모듈 메인 배선', wholesale: 33000, retail: 77000 },
  { id: 14, category: '배선/부품', name: 'OBD 배선', wholesale: 16500, retail: 33000 },
  { id: 15, category: '배선/부품', name: '모듈 케이블 휴즈 등', wholesale: 16500, retail: 33000 },
  { id: 16, category: '배선/부품', name: '스피커 배선', wholesale: 22000, retail: 33000 },
  { id: 17, category: '배선/부품', name: '스피커 콘지 교체용', wholesale: 38500, retail: 110000 },
  
  // 레조 소음기 (29개)
  { id: 18, category: '레조 소음기', name: '레조 100 150 51', wholesale: 38500, retail: null },
  { id: 19, category: '레조 소음기', name: '레조 100 150 54', wholesale: 38500, retail: null },
  { id: 20, category: '레조 소음기', name: '레조 100 150 61', wholesale: 38500, retail: null },
  { id: 21, category: '레조 소음기', name: '레조 100 150 64', wholesale: 38500, retail: null },
  { id: 22, category: '레조 소음기', name: '레조 100 200 51', wholesale: 38500, retail: null },
  { id: 23, category: '레조 소음기', name: '레조 100 200 54', wholesale: 38500, retail: null },
  { id: 24, category: '레조 소음기', name: '레조 100 200 61', wholesale: 38500, retail: null },
  { id: 25, category: '레조 소음기', name: '레조 100 200 64', wholesale: 38500, retail: null },
  { id: 26, category: '레조 소음기', name: '레조 100 250 51', wholesale: 38500, retail: null },
  { id: 27, category: '레조 소음기', name: '레조 100 250 54', wholesale: 38500, retail: null },
  { id: 28, category: '레조 소음기', name: '레조 100 250 61', wholesale: 38500, retail: null },
  { id: 29, category: '레조 소음기', name: '레조 100 250 64', wholesale: 38500, retail: null },
  { id: 30, category: '레조 소음기', name: '레조 100 250 77', wholesale: 38500, retail: null },
  { id: 31, category: '레조 소음기', name: '레조 114 250 54', wholesale: 49500, retail: null },
  { id: 32, category: '레조 소음기', name: '레조 114 250 61', wholesale: 49500, retail: null },
  { id: 33, category: '레조 소음기', name: '레조 114 250 64', wholesale: 49500, retail: null },
  { id: 34, category: '레조 소음기', name: '레조 114 250 77', wholesale: 49500, retail: null },
  { id: 35, category: '레조 소음기', name: '레조 114 300 54', wholesale: 49500, retail: null },
  { id: 36, category: '레조 소음기', name: '레조 114 300 61', wholesale: 49500, retail: null },
  { id: 37, category: '레조 소음기', name: '레조 114 300 64', wholesale: 49500, retail: null },
  { id: 38, category: '레조 소음기', name: '레조 114 300 77', wholesale: 49500, retail: null },
  { id: 39, category: '레조 소음기', name: '레조 150 220 54', wholesale: 60500, retail: null },
  { id: 40, category: '레조 소음기', name: '레조 150 220 61', wholesale: 60500, retail: null },
  { id: 41, category: '레조 소음기', name: '레조 150 220 64', wholesale: 60500, retail: null },
  { id: 42, category: '레조 소음기', name: '레조 150 220 77', wholesale: 60500, retail: null },
  { id: 43, category: '레조 소음기', name: '레조 150 300 54', wholesale: 60500, retail: null },
  { id: 44, category: '레조 소음기', name: '레조 150 300 61', wholesale: 60500, retail: null },
  { id: 45, category: '레조 소음기', name: '레조 150 300 64', wholesale: 60500, retail: null },
  { id: 46, category: '레조 소음기', name: '레조 150 300 77', wholesale: 60500, retail: null },
  
  // CH 공갈 레조 (11개)
  { id: 47, category: 'CH 공갈 레조', name: 'CH 150 54', wholesale: 29700, retail: null },
  { id: 48, category: 'CH 공갈 레조', name: 'CH 150 61', wholesale: 29700, retail: null },
  { id: 49, category: 'CH 공갈 레조', name: 'CH 150 64', wholesale: 29700, retail: null },
  { id: 50, category: 'CH 공갈 레조', name: 'CH 200 54', wholesale: 30800, retail: null },
  { id: 51, category: 'CH 공갈 레조', name: 'CH 200 61', wholesale: 30800, retail: null },
  { id: 52, category: 'CH 공갈 레조', name: 'CH 200 64', wholesale: 30800, retail: null },
  { id: 53, category: 'CH 공갈 레조', name: 'CH 200 70', wholesale: 30800, retail: null },
  { id: 54, category: 'CH 공갈 레조', name: 'CH 200 77', wholesale: 30800, retail: null },
  { id: 55, category: 'CH 공갈 레조', name: 'CH 250 54', wholesale: 31900, retail: null },
  { id: 56, category: 'CH 공갈 레조', name: 'CH 250 61', wholesale: 31900, retail: null },
  { id: 57, category: 'CH 공갈 레조', name: 'CH 250 64', wholesale: 31900, retail: null },
  
  // TVB 용접X (10개)
  { id: 58, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 5451 좌,우 1세트', wholesale: 220000, retail: null },
  { id: 59, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 5451 L', wholesale: 110000, retail: null },
  { id: 60, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 5451 R', wholesale: 110000, retail: null },
  { id: 61, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 6461 좌,우 1세트', wholesale: 220000, retail: null },
  { id: 62, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 6461 L', wholesale: 110000, retail: null },
  { id: 63, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 6461 R', wholesale: 110000, retail: null },
  { id: 64, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 77 좌,우 1세트', wholesale: 242000, retail: null },
  { id: 65, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 77 L', wholesale: 121000, retail: null },
  { id: 66, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 77 R', wholesale: 121000, retail: null },
  { id: 67, category: 'TVB 진공식 가변 소음기 (용접X)', name: '용접 안된 TVB 77 전용 h관', wholesale: 22000, retail: null },
  
  // MVB 용접O (12개)
  { id: 68, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 Y 좌,우 1세트', wholesale: 365200, retail: null },
  { id: 69, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 Y L', wholesale: 182600, retail: null },
  { id: 70, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 Y R', wholesale: 182600, retail: null },
  { id: 71, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 Y 좌,우 1세트', wholesale: 365200, retail: null },
  { id: 72, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 Y L', wholesale: 182600, retail: null },
  { id: 73, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 Y R', wholesale: 182600, retail: null },
  { id: 74, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 h 좌,우 1세트', wholesale: 365200, retail: null },
  { id: 75, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 h L', wholesale: 182600, retail: null },
  { id: 76, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 54 h R', wholesale: 182600, retail: null },
  { id: 77, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 h 좌,우 1세트', wholesale: 365200, retail: null },
  { id: 78, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 h L', wholesale: 182600, retail: null },
  { id: 79, category: 'MVB 전자식 가변 소음기 (용접O)', name: '용접된 MVB 64 h R', wholesale: 182600, retail: null },
  
  // MV KIT (5개)
  { id: 80, category: 'MV KIT', name: 'MV KIT', wholesale: 162800, retail: null },
  { id: 81, category: 'MV KIT', name: 'MVB 54Y 좌,우 MV 킷 세트', wholesale: 502700, retail: null },
  { id: 82, category: 'MV KIT', name: 'MVB 54h 좌,우 MV 킷 세트', wholesale: 502700, retail: null },
  { id: 83, category: 'MV KIT', name: 'MVB 64Y 좌,우 MV 킷 세트', wholesale: 502700, retail: null },
  { id: 84, category: 'MV KIT', name: 'MVB 64h 좌,우 MV 킷 세트', wholesale: 502700, retail: null },
  
  // TVB 용접O (12개)
  { id: 85, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 Y 좌,우 1세트', wholesale: 363000, retail: null },
  { id: 86, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 Y L', wholesale: 181500, retail: null },
  { id: 87, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 Y R', wholesale: 181500, retail: null },
  { id: 88, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 Y 좌,우 1세트', wholesale: 363000, retail: null },
  { id: 89, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 Y L', wholesale: 181500, retail: null },
  { id: 90, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 Y R', wholesale: 181500, retail: null },
  { id: 91, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 h 좌,우 1세트', wholesale: 363000, retail: null },
  { id: 92, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 h L', wholesale: 181500, retail: null },
  { id: 93, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 54 h R', wholesale: 181500, retail: null },
  { id: 94, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 h 좌,우 1세트', wholesale: 363000, retail: null },
  { id: 95, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 h L', wholesale: 181500, retail: null },
  { id: 96, category: 'TVB 진공식 가변 소음기 (용접O)', name: '용접된 TVB 64 h R', wholesale: 181500, retail: null },
  
  // T가변 바디 (10개)
  { id: 97, category: 'T가변 바디', name: 'T가변 바디 VT 6454', wholesale: 286000, retail: null },
  { id: 98, category: 'T가변 바디', name: 'T가변 바디 VT 76 370SC', wholesale: 363000, retail: null },
  { id: 99, category: 'T가변 바디', name: 'T가변 바디 VT 76 370S', wholesale: 363000, retail: null },
  { id: 100, category: 'T가변 바디', name: 'T가변 바디 VT 76 780D 650', wholesale: 682000, retail: null },
  { id: 101, category: 'T가변 바디', name: 'T가변 바디 VT 80 710S', wholesale: 440000, retail: null },
  { id: 102, category: 'T가변 바디', name: 'T가변 바디 VT 76 612D 480', wholesale: 484000, retail: null },
  { id: 103, category: 'T가변 바디', name: 'T가변 바디 VT 76 520D 380', wholesale: 440000, retail: null },
  { id: 104, category: 'T가변 바디', name: 'T가변 바디 VT 76 440D 140', wholesale: 440000, retail: null },
  { id: 105, category: 'T가변 바디', name: 'T가변 바디 VT 76 440D 300', wholesale: 440000, retail: null },
  { id: 106, category: 'T가변 바디', name: 'X64 바디', wholesale: 88000, retail: null },
  { id: 107, category: 'T가변 바디', name: 'H64 바디', wholesale: 88000, retail: null },
  
  // 가변밸브/리모컨 (11개)
  { id: 108, category: '가변밸브/리모컨', name: '가변 밸브만 VV 54', wholesale: 88000, retail: null },
  { id: 109, category: '가변밸브/리모컨', name: '가변 밸브만 VV 64', wholesale: 88000, retail: null },
  { id: 110, category: '가변밸브/리모컨', name: '가변 밸브만 VV 76', wholesale: 99000, retail: null },
  { id: 111, category: '가변밸브/리모컨', name: '진공식 리모컨 모듈 세트 FXR', wholesale: 53900, retail: null },
  { id: 112, category: '가변밸브/리모컨', name: '리모컨 가변 스위치', wholesale: 4400, retail: null },
  { id: 113, category: '가변밸브/리모컨', name: '체크 밸브', wholesale: 123, retail: null },
  { id: 114, category: '가변밸브/리모컨', name: '솔레노이드 밸브', wholesale: 123, retail: null },
  { id: 115, category: '가변밸브/리모컨', name: 'T 밸브', wholesale: 123, retail: null },
  { id: 116, category: '가변밸브/리모컨', name: '진공 무선 리모컨 풀 세트 FXPW', wholesale: 95700, retail: null },
  { id: 117, category: '가변밸브/리모컨', name: '진공 유선 스위치 풀 세트 FXPS', wholesale: 44000, retail: null },
  { id: 118, category: '가변밸브/리모컨', name: '진공 펌프 VP KIT', wholesale: 143000, retail: null },
  
  // 카본 머플러팁 (16개)
  { id: 119, category: '카본 머플러팁', name: '카본 싱글 SCF 93S-G', wholesale: 72600, retail: null },
  { id: 120, category: '카본 머플러팁', name: '카본 싱글 SCF 103S-G', wholesale: 83600, retail: null },
  { id: 121, category: '카본 머플러팁', name: '카본 싱글 SCF 116S-G', wholesale: 89100, retail: null },
  { id: 122, category: '카본 머플러팁', name: '카본 싱글 SCF 130S-G', wholesale: 143000, retail: null },
  { id: 123, category: '카본 머플러팁', name: '카본 듀얼 SCF 93D-G', wholesale: 145200, retail: null },
  { id: 124, category: '카본 머플러팁', name: '카본 듀얼 SCF 103D-G', wholesale: 167200, retail: null },
  { id: 125, category: '카본 머플러팁', name: '카본 듀얼 SCF 116D-G', wholesale: 178200, retail: null },
  { id: 126, category: '카본 머플러팁', name: '카본 싱글 CFK 80S-G', wholesale: 66000, retail: null },
  { id: 127, category: '카본 머플러팁', name: '카본 싱글 CFK 93S-G', wholesale: 66000, retail: null },
  { id: 128, category: '카본 머플러팁', name: '카본 싱글 CFK 103S-G', wholesale: 77000, retail: null },
  { id: 129, category: '카본 머플러팁', name: '카본 싱글 CFK 116S-G', wholesale: 82500, retail: null },
  { id: 130, category: '카본 머플러팁', name: '카본 듀얼 CFK 80D-G', wholesale: 132000, retail: null },
  { id: 131, category: '카본 머플러팁', name: '카본 듀얼 CFK 93D-G', wholesale: 132000, retail: null },
  { id: 132, category: '카본 머플러팁', name: '카본 듀얼 CFK 103D-G', wholesale: 154000, retail: null },
  { id: 133, category: '카본 머플러팁', name: '카본 듀얼 CFK 116D-G', wholesale: 165000, retail: null },
  { id: 134, category: '카본 머플러팁', name: '카본 싱글 NCF 130S-G', wholesale: 143000, retail: null },
  
  // NPK 머플러팁 (24개)
  { id: 135, category: 'NPK 머플러팁', name: '듀얼 NPK 80D-S', wholesale: 41250, retail: null },
  { id: 136, category: 'NPK 머플러팁', name: '듀얼 NPK 80D-T', wholesale: 57750, retail: null },
  { id: 137, category: 'NPK 머플러팁', name: '듀얼 NPK 80D-B', wholesale: 57750, retail: null },
  { id: 138, category: 'NPK 머플러팁', name: '싱글 NPK 80S-S', wholesale: 18150, retail: null },
  { id: 139, category: 'NPK 머플러팁', name: '싱글 NPK 80S-T', wholesale: 26400, retail: null },
  { id: 140, category: 'NPK 머플러팁', name: '싱글 NPK 80S-B', wholesale: 26400, retail: null },
  { id: 141, category: 'NPK 머플러팁', name: '듀얼 NPK 89D-S', wholesale: 41250, retail: null },
  { id: 142, category: 'NPK 머플러팁', name: '듀얼 NPK 89D-T', wholesale: 57750, retail: null },
  { id: 143, category: 'NPK 머플러팁', name: '듀얼 NPK 89D-B', wholesale: 57750, retail: null },
  { id: 144, category: 'NPK 머플러팁', name: '싱글 NPK 89S-S', wholesale: 18150, retail: null },
  { id: 145, category: 'NPK 머플러팁', name: '싱글 NPK 89S-T', wholesale: 26400, retail: null },
  { id: 146, category: 'NPK 머플러팁', name: '싱글 NPK 89S-B', wholesale: 26400, retail: null },
  { id: 147, category: 'NPK 머플러팁', name: '듀얼 NPK 100D-S', wholesale: 52250, retail: null },
  { id: 148, category: 'NPK 머플러팁', name: '듀얼 NPK 100D-T', wholesale: 78760, retail: null },
  { id: 149, category: 'NPK 머플러팁', name: '듀얼 NPK 100D-B', wholesale: 78760, retail: null },
  { id: 150, category: 'NPK 머플러팁', name: '싱글 NPK 100S-S', wholesale: 23650, retail: null },
  { id: 151, category: 'NPK 머플러팁', name: '싱글 NPK 100S-T', wholesale: 36850, retail: null },
  { id: 152, category: 'NPK 머플러팁', name: '싱글 NPK 100S-B', wholesale: 36850, retail: null },
  { id: 153, category: 'NPK 머플러팁', name: '듀얼 NPK 114D-S', wholesale: 7700, retail: null },
  { id: 154, category: 'NPK 머플러팁', name: '듀얼 NPK 114D-T', wholesale: 96800, retail: null },
  { id: 155, category: 'NPK 머플러팁', name: '듀얼 NPK 114D-B', wholesale: 96800, retail: null },
  { id: 156, category: 'NPK 머플러팁', name: '싱글 NPK 114S-S', wholesale: 35750, retail: null },
  { id: 157, category: 'NPK 머플러팁', name: '싱글 NPK 114S-T', wholesale: 46200, retail: null },
  { id: 158, category: 'NPK 머플러팁', name: '싱글 NPK 114S-B', wholesale: 46200, retail: null },
  
  // SNPK 슬롯 머플러팁 (24개)
  { id: 159, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 89D-S', wholesale: 51700, retail: null },
  { id: 160, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 89D-T', wholesale: 65450, retail: null },
  { id: 161, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 89D-B', wholesale: 65450, retail: null },
  { id: 162, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 89S-S', wholesale: 23100, retail: null },
  { id: 163, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 89S-T', wholesale: 30250, retail: null },
  { id: 164, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 89S-B', wholesale: 30250, retail: null },
  { id: 165, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 100D-S', wholesale: 59950, retail: null },
  { id: 166, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 100D-T', wholesale: 76450, retail: null },
  { id: 167, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 100D-B', wholesale: 78650, retail: null },
  { id: 168, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 100S-S', wholesale: 27500, retail: null },
  { id: 169, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 100S-T', wholesale: 35750, retail: null },
  { id: 170, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 100S-B', wholesale: 36850, retail: null },
  { id: 171, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 114D-S', wholesale: 83600, retail: null },
  { id: 172, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 114D-T', wholesale: 104500, retail: null },
  { id: 173, category: 'SNPK 슬롯팁', name: '슬롯 듀얼 SNPK 114D-B', wholesale: 105600, retail: null },
  { id: 174, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 114S-S', wholesale: 39050, retail: null },
  { id: 175, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 114S-T', wholesale: 49500, retail: null },
  { id: 176, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 114S-B', wholesale: 50050, retail: null },
  { id: 177, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 127S-S', wholesale: 48400, retail: null },
  { id: 178, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 127S-T', wholesale: 55000, retail: null },
  { id: 179, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 127S-B', wholesale: 57200, retail: null },
  { id: 180, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 142S-S', wholesale: 89100, retail: null },
  { id: 181, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 142S-T', wholesale: 100100, retail: null },
  { id: 182, category: 'SNPK 슬롯팁', name: '슬롯 싱글 SNPK 142S-B', wholesale: 102300, retail: null },
  
  // 사각팁/AMG (14개)
  { id: 183, category: '사각팁/AMG', name: '사각팁 DSQ1-S', wholesale: 176000, retail: null },
  { id: 184, category: '사각팁/AMG', name: '사각팁 DSQ1-T', wholesale: 220000, retail: null },
  { id: 185, category: '사각팁/AMG', name: '사각팁 DSQ1-B', wholesale: 220000, retail: null },
  { id: 186, category: '사각팁/AMG', name: '사각팁 DSQ1-R', wholesale: 220000, retail: null },
  { id: 187, category: '사각팁/AMG', name: '사각팁 DSQ1-G', wholesale: 220000, retail: null },
  { id: 188, category: '사각팁/AMG', name: '사각팁 DSQ2-S', wholesale: 220000, retail: null },
  { id: 189, category: '사각팁/AMG', name: '사각팁 DSQ2-T', wholesale: 275000, retail: null },
  { id: 190, category: '사각팁/AMG', name: '사각팁 DSQ2-B', wholesale: 275000, retail: null },
  { id: 191, category: '사각팁/AMG', name: '구형 AMG 커버팁 실버', wholesale: 200000, retail: null },
  { id: 192, category: '사각팁/AMG', name: '구형 AMG 커버팁 블랙', wholesale: 220000, retail: null },
  { id: 193, category: '사각팁/AMG', name: '신형 AMG 커버팁 실버', wholesale: 220000, retail: null },
  { id: 194, category: '사각팁/AMG', name: '신형 AMG 커버팁 블랙', wholesale: 242000, retail: null },
  { id: 195, category: '사각팁/AMG', name: 'AMG OLD 용접타입 h관', wholesale: 200000, retail: null },
  { id: 196, category: '사각팁/AMG', name: 'T 분배관 T6454', wholesale: 24200, retail: null },
  
  // 촉매/센서 (4개)
  { id: 197, category: '촉매/센서', name: '스포츠 촉매 C100S', wholesale: 189200, retail: null },
  { id: 198, category: '촉매/센서', name: '스포츠 촉매 C200S', wholesale: 189200, retail: null },
  { id: 199, category: '촉매/센서', name: '스포츠 촉매 C300S', wholesale: 123, retail: null },
  { id: 200, category: '촉매/센서', name: '산소 센서 너트', wholesale: 1650, retail: null },
  
  // 자바라 (14개)
  { id: 201, category: '자바라', name: '자바라 SF 54 S 길이 120', wholesale: 36300, retail: null },
  { id: 202, category: '자바라', name: '자바라 SF 54 S 길이 100', wholesale: 36300, retail: null },
  { id: 203, category: '자바라', name: '자바라 SF 54 S 길이 80', wholesale: 36300, retail: null },
  { id: 204, category: '자바라', name: '자바라 SF 61 S 길이 120', wholesale: 36300, retail: null },
  { id: 205, category: '자바라', name: '자바라 SF 61 S 길이 100', wholesale: 36300, retail: null },
  { id: 206, category: '자바라', name: '자바라 SF 61 S 길이 80', wholesale: 36300, retail: null },
  { id: 207, category: '자바라', name: '자바라 SF 64 S 길이 120', wholesale: null, retail: null },
  { id: 208, category: '자바라', name: '자바라 SF 64 S 길이 100', wholesale: null, retail: null },
  { id: 209, category: '자바라', name: '자바라 SF 64 S 길이 80', wholesale: 36300, retail: null },
  { id: 210, category: '자바라', name: '자바라 SF 54 L 길이 160', wholesale: 41800, retail: null },
  { id: 211, category: '자바라', name: '자바라 SF 61 L 길이 160', wholesale: 41800, retail: null },
  { id: 212, category: '자바라', name: '자바라 SF 64 L 길이 160', wholesale: 41800, retail: null },
  { id: 213, category: '자바라', name: '자바라 SF 70 L 길이 160', wholesale: 55000, retail: null },
  { id: 214, category: '자바라', name: '자바라 SF 76 L 길이 160', wholesale: 55000, retail: null },
  
  // 인터쿨러 (10개)
  { id: 215, category: '인터쿨러', name: '인터쿨러 IT 4020', wholesale: 176000, retail: null },
  { id: 216, category: '인터쿨러', name: '인터쿨러 IT 4323', wholesale: 181500, retail: null },
  { id: 217, category: '인터쿨러', name: '인터쿨러 IT 5023', wholesale: 192500, retail: null },
  { id: 218, category: '인터쿨러', name: '인터쿨러 IT 5523', wholesale: 203500, retail: null },
  { id: 219, category: '인터쿨러', name: '인터쿨러 IT 6020', wholesale: 198000, retail: null },
  { id: 220, category: '인터쿨러', name: '인터쿨러 IT 6030', wholesale: 286000, retail: null },
  { id: 221, category: '인터쿨러', name: '인터쿨러 IT 6024', wholesale: 220000, retail: null },
  { id: 222, category: '인터쿨러', name: '인터쿨러 IT 6030GT', wholesale: 594000, retail: null },
  { id: 223, category: '인터쿨러', name: '인터쿨러 IT 4320R', wholesale: 187000, retail: null },
  { id: 224, category: '인터쿨러', name: '인터쿨러 IT 5520R', wholesale: 209000, retail: null },
  
  // 실리콘 직선호스 (9개)
  { id: 225, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS50', wholesale: 5500, retail: null },
  { id: 226, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS54', wholesale: 6050, retail: null },
  { id: 227, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS60', wholesale: 6600, retail: null },
  { id: 228, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS63', wholesale: 7150, retail: null },
  { id: 229, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS70', wholesale: 7700, retail: null },
  { id: 230, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS76', wholesale: 8250, retail: null },
  { id: 231, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS80', wholesale: 8800, retail: null },
  { id: 232, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS90', wholesale: 9900, retail: null },
  { id: 233, category: '실리콘 직선호스', name: '실리콘 직선 호스 SS100', wholesale: 11000, retail: null },
  
  // 실리콘 레듀샤호스 (22개)
  { id: 234, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR4050', wholesale: 6050, retail: null },
  { id: 235, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR4060', wholesale: 7150, retail: null },
  { id: 236, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5060', wholesale: 7150, retail: null },
  { id: 237, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5063', wholesale: 7150, retail: null },
  { id: 238, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5070', wholesale: 8250, retail: null },
  { id: 239, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5076', wholesale: 8800, retail: null },
  { id: 240, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5460', wholesale: 7150, retail: null },
  { id: 241, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR5463', wholesale: 7700, retail: null },
  { id: 242, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6063', wholesale: 7700, retail: null },
  { id: 243, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6070', wholesale: 8250, retail: null },
  { id: 244, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6076', wholesale: 8800, retail: null },
  { id: 245, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6080', wholesale: 9350, retail: null },
  { id: 246, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6370', wholesale: 8250, retail: null },
  { id: 247, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6376', wholesale: 8800, retail: null },
  { id: 248, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR6380', wholesale: 9350, retail: null },
  { id: 249, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR7076', wholesale: 8800, retail: null },
  { id: 250, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR7080', wholesale: 9680, retail: null },
  { id: 251, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR70100', wholesale: 14850, retail: null },
  { id: 252, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR76100', wholesale: 13200, retail: null },
  { id: 253, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR8090', wholesale: 14300, retail: null },
  { id: 254, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR80100', wholesale: 15400, retail: null },
  { id: 255, category: '실리콘 레듀샤', name: '실리콘 레듀샤 SR90100', wholesale: 16500, retail: null },
  
  // 실리콘 진공호스 (7개)
  { id: 256, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV3', wholesale: 12100, retail: null },
  { id: 257, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV4', wholesale: 14300, retail: null },
  { id: 258, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV6', wholesale: 22000, retail: null },
  { id: 259, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV8', wholesale: 29700, retail: null },
  { id: 260, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV10', wholesale: 41800, retail: null },
  { id: 261, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV12', wholesale: 53900, retail: null },
  { id: 262, category: '실리콘 진공호스', name: '실리콘 진공 라인 5m SV20', wholesale: 92400, retail: null },
  
  // 실리콘 엘보 (20개)
  { id: 263, category: '실리콘 엘보', name: '실리콘 엘보 90SEL50', wholesale: 16500, retail: null },
  { id: 264, category: '실리콘 엘보', name: '실리콘 엘보 90SEL60', wholesale: 19800, retail: null },
  { id: 265, category: '실리콘 엘보', name: '실리콘 엘보 90SEL63', wholesale: 19800, retail: null },
  { id: 266, category: '실리콘 엘보', name: '실리콘 엘보 90SEL70', wholesale: 24200, retail: null },
  { id: 267, category: '실리콘 엘보', name: '실리콘 엘보 90SEL80', wholesale: 27500, retail: null },
  { id: 268, category: '실리콘 엘보', name: '실리콘 엘보 45SEL50', wholesale: 16500, retail: null },
  { id: 269, category: '실리콘 엘보', name: '실리콘 엘보 45SEL60', wholesale: 19800, retail: null },
  { id: 270, category: '실리콘 엘보', name: '실리콘 엘보 45SEL63', wholesale: 19800, retail: null },
  { id: 271, category: '실리콘 엘보', name: '실리콘 엘보 45SEL70', wholesale: 24200, retail: null },
  { id: 272, category: '실리콘 엘보', name: '실리콘 엘보 45SEL80', wholesale: 27500, retail: null },
  { id: 273, category: '실리콘 엘보', name: '실리콘 엘보 90SER5060', wholesale: 24200, retail: null },
  { id: 274, category: '실리콘 엘보', name: '실리콘 엘보 90SER5063', wholesale: 24200, retail: null },
  { id: 275, category: '실리콘 엘보', name: '실리콘 엘보 90SER6070', wholesale: 30800, retail: null },
  { id: 276, category: '실리콘 엘보', name: '실리콘 엘보 90SER6370', wholesale: 30800, retail: null },
  { id: 277, category: '실리콘 엘보', name: '실리콘 엘보 90SER7080', wholesale: 30800, retail: null },
  { id: 278, category: '실리콘 엘보', name: '실리콘 엘보 45SER5060', wholesale: 24200, retail: null },
  { id: 279, category: '실리콘 엘보', name: '실리콘 엘보 45SER5063', wholesale: 24200, retail: null },
  { id: 280, category: '실리콘 엘보', name: '실리콘 엘보 45SER6070', wholesale: 30800, retail: null },
  { id: 281, category: '실리콘 엘보', name: '실리콘 엘보 45SER6370', wholesale: 30800, retail: null },
  { id: 282, category: '실리콘 엘보', name: '실리콘 엘보 45SER7080', wholesale: 30800, retail: null },
  { id: 283, category: '실리콘 엘보', name: '실리콘 엘보 135SEL50', wholesale: 49500, retail: null },
  { id: 284, category: '실리콘 엘보', name: '실리콘 엘보 135SEL63', wholesale: 60500, retail: null },
  { id: 285, category: '실리콘 엘보', name: '실리콘 엘보 135SEL70', wholesale: 71500, retail: null },
  { id: 286, category: '실리콘 엘보', name: '실리콘 험프 HUM60', wholesale: 16500, retail: null },
  { id: 287, category: '실리콘 엘보', name: '실리콘 험프 HUM5460', wholesale: 19800, retail: null },
  
  // 플랜지 (9개)
  { id: 288, category: '플랜지', name: '플랜지 FL 51', wholesale: 4400, retail: null },
  { id: 289, category: '플랜지', name: '플랜지 FL 54', wholesale: 4400, retail: null },
  { id: 290, category: '플랜지', name: '플랜지 FL 61', wholesale: 4400, retail: null },
  { id: 291, category: '플랜지', name: '플랜지 FL 63', wholesale: 4400, retail: null },
  { id: 292, category: '플랜지', name: '플랜지 FL 63 BIG', wholesale: 12, retail: null },
  { id: 293, category: '플랜지', name: '플랜지 FL 65', wholesale: 4600, retail: null },
  { id: 294, category: '플랜지', name: '플랜지 FL 70', wholesale: 5060, retail: null },
  { id: 295, category: '플랜지', name: '플랜지 FL 76', wholesale: 5060, retail: null },
  { id: 296, category: '플랜지', name: '배기 행거', wholesale: 2970, retail: null },
  
  // 스덴 파이프 (34개)
  { id: 297, category: '스덴 파이프', name: '스덴 직선 파이프 2m 50파이', wholesale: 52250, retail: null },
  { id: 298, category: '스덴 파이프', name: '스덴 직선 파이프 2m 54파이', wholesale: 55000, retail: null },
  { id: 299, category: '스덴 파이프', name: '스덴 직선 파이프 2m 60파이', wholesale: 60500, retail: null },
  { id: 300, category: '스덴 파이프', name: '스덴 직선 파이프 2m 63파이', wholesale: 63800, retail: null },
  { id: 301, category: '스덴 파이프', name: '스덴 직선 파이프 2m 70파이', wholesale: 99000, retail: null },
  { id: 302, category: '스덴 파이프', name: '스덴 밴딩 51-15', wholesale: 10450, retail: null },
  { id: 303, category: '스덴 파이프', name: '스덴 밴딩 51-30', wholesale: 10450, retail: null },
  { id: 304, category: '스덴 파이프', name: '스덴 밴딩 51-45', wholesale: 10450, retail: null },
  { id: 305, category: '스덴 파이프', name: '스덴 밴딩 51-90', wholesale: 10450, retail: null },
  { id: 306, category: '스덴 파이프', name: '스덴 밴딩 51-60', wholesale: 10450, retail: null },
  { id: 307, category: '스덴 파이프', name: '스덴 밴딩 51-75', wholesale: 10450, retail: null },
  { id: 308, category: '스덴 파이프', name: '스덴 밴딩 54-15', wholesale: 11000, retail: null },
  { id: 309, category: '스덴 파이프', name: '스덴 밴딩 54-30', wholesale: 11000, retail: null },
  { id: 310, category: '스덴 파이프', name: '스덴 밴딩 54-45', wholesale: 11000, retail: null },
  { id: 311, category: '스덴 파이프', name: '스덴 밴딩 54-90', wholesale: 11000, retail: null },
  { id: 312, category: '스덴 파이프', name: '스덴 밴딩 54-60', wholesale: 11000, retail: null },
  { id: 313, category: '스덴 파이프', name: '스덴 밴딩 54-75', wholesale: 11000, retail: null },
  { id: 314, category: '스덴 파이프', name: '스덴 밴딩 60-15', wholesale: 12100, retail: null },
  { id: 315, category: '스덴 파이프', name: '스덴 밴딩 60-30', wholesale: 12100, retail: null },
  { id: 316, category: '스덴 파이프', name: '스덴 밴딩 60-45', wholesale: 12100, retail: null },
  { id: 317, category: '스덴 파이프', name: '스덴 밴딩 60-90', wholesale: 12100, retail: null },
  { id: 318, category: '스덴 파이프', name: '스덴 밴딩 60-60', wholesale: 12100, retail: null },
  { id: 319, category: '스덴 파이프', name: '스덴 밴딩 60-75', wholesale: 12100, retail: null },
  { id: 320, category: '스덴 파이프', name: '스덴 밴딩 63-15', wholesale: 13200, retail: null },
  { id: 321, category: '스덴 파이프', name: '스덴 밴딩 63-30', wholesale: 13200, retail: null },
  { id: 322, category: '스덴 파이프', name: '스덴 밴딩 63-45', wholesale: 13200, retail: null },
  { id: 323, category: '스덴 파이프', name: '스덴 밴딩 63-90', wholesale: 13200, retail: null },
  { id: 324, category: '스덴 파이프', name: '스덴 밴딩 63-60', wholesale: 13200, retail: null },
  { id: 325, category: '스덴 파이프', name: '스덴 밴딩 63-75', wholesale: 13200, retail: null },
  { id: 326, category: '스덴 파이프', name: '스덴 밴딩 70-45', wholesale: 25300, retail: null },
  { id: 327, category: '스덴 파이프', name: '스덴 밴딩 70-90', wholesale: 25300, retail: null },
  { id: 328, category: '스덴 파이프', name: '스덴 밴딩 76-45', wholesale: 18700, retail: null },
  { id: 329, category: '스덴 파이프', name: '스덴 밴딩 76-90', wholesale: 18700, retail: null },
  { id: 330, category: '스덴 파이프', name: '스덴 단엘보 50-45', wholesale: 4950, retail: null },
  { id: 331, category: '스덴 파이프', name: '스덴 단엘보 50-90', wholesale: 4950, retail: null },
  { id: 332, category: '스덴 파이프', name: '스덴 단엘보 63-45', wholesale: 6600, retail: null },
  { id: 333, category: '스덴 파이프', name: '스덴 단엘보 63-90', wholesale: 6600, retail: null },
  { id: 334, category: '스덴 파이프', name: '스덴 단엘보 76-45', wholesale: 8800, retail: null },
  { id: 335, category: '스덴 파이프', name: '스덴 단엘보 76-90', wholesale: 8800, retail: null },
  
  // 알루미늄 파이프 (8개)
  { id: 336, category: '알루미늄 파이프', name: '알루미늄 밴딩 50-45', wholesale: 15400, retail: null },
  { id: 337, category: '알루미늄 파이프', name: '알루미늄 밴딩 50-90', wholesale: 15400, retail: null },
  { id: 338, category: '알루미늄 파이프', name: '알루미늄 밴딩 60-45', wholesale: 17600, retail: null },
  { id: 339, category: '알루미늄 파이프', name: '알루미늄 밴딩 60-90', wholesale: 17600, retail: null },
  { id: 340, category: '알루미늄 파이프', name: '알루미늄 밴딩 70-45', wholesale: 18700, retail: null },
  { id: 341, category: '알루미늄 파이프', name: '알루미늄 밴딩 70-90', wholesale: 18700, retail: null },
  { id: 342, category: '알루미늄 파이프', name: '알루미늄 밴딩 80-45', wholesale: 27500, retail: null },
  { id: 343, category: '알루미늄 파이프', name: '알루미늄 밴딩 80-90', wholesale: 27500, retail: null },
  
  // 클램프 (18개)
  { id: 344, category: '클램프', name: '클램프 반도 8-12', wholesale: 480, retail: null },
  { id: 345, category: '클램프', name: '클램프 반도 10-16', wholesale: 480, retail: null },
  { id: 346, category: '클램프', name: '클램프 반도 13-19', wholesale: 480, retail: null },
  { id: 347, category: '클램프', name: '클램프 반도 16-25', wholesale: 480, retail: null },
  { id: 348, category: '클램프', name: '클램프 반도 19-29', wholesale: 560, retail: null },
  { id: 349, category: '클램프', name: '클램프 반도 22-32', wholesale: 560, retail: null },
  { id: 350, category: '클램프', name: '클램프 반도 32-44', wholesale: 560, retail: null },
  { id: 351, category: '클램프', name: '클램프 반도 35-50', wholesale: 600, retail: null },
  { id: 352, category: '클램프', name: '클램프 반도 38-57', wholesale: 640, retail: null },
  { id: 353, category: '클램프', name: '클램프 반도 40-64', wholesale: 1200, retail: null },
  { id: 354, category: '클램프', name: '클램프 반도 60-80', wholesale: 1200, retail: null },
  { id: 355, category: '클램프', name: '클램프 반도 50-70', wholesale: 1200, retail: null },
  { id: 356, category: '클램프', name: '클램프 반도 64-76', wholesale: 1200, retail: null },
  { id: 357, category: '클램프', name: '클램프 반도 70-90', wholesale: 1600, retail: null },
  { id: 358, category: '클램프', name: '클램프 반도 80-100', wholesale: 1600, retail: null },
  { id: 359, category: '클램프', name: '클램프 반도 90-110', wholesale: 1600, retail: null },
  { id: 360, category: '클램프', name: '클램프 반도 100-120', wholesale: 1600, retail: null },
  
  // 기타부품 (2개)
  { id: 361, category: '기타부품', name: 'y관', wholesale: 20000, retail: null },
  { id: 362, category: '기타부품', name: 'h관', wholesale: 25000, retail: null },
  
  // 제네시스쿠페 전용 (38개)
  { id: 363, category: '제네시스쿠페', name: '젠쿱3.8 서지탱크 스페이서', wholesale: 220000, retail: 250000 },
  { id: 364, category: '제네시스쿠페', name: '젠쿱 드리프 타각킷', wholesale: 209000, retail: 270000 },
  { id: 365, category: '제네시스쿠페', name: '젠쿱 드리프트 타각킷+너클 세트', wholesale: 517000, retail: 700000 },
  { id: 366, category: '제네시스쿠페', name: '젠쿱 BK1 BK2 타각 너클 1대분', wholesale: 330000, retail: 450000 },
  { id: 367, category: '제네시스쿠페', name: '젠쿱 번웨이X게버트 덕테일', wholesale: 264000, retail: 350000 },
  { id: 368, category: '제네시스쿠페', name: '젠쿱 번웨이X게버트 덕테일 GEN1.5', wholesale: 319000, retail: 400000 },
  { id: 369, category: '제네시스쿠페', name: '젠쿱 FRP 경량 트렁크', wholesale: 330000, retail: 450000 },
  { id: 370, category: '제네시스쿠페', name: '젠쿱 FRP 경량 도어', wholesale: 770000, retail: 990000 },
  { id: 371, category: '제네시스쿠페', name: '젠쿱 FRP 글라스 윙', wholesale: 110000, retail: 135000 },
  { id: 372, category: '제네시스쿠페', name: '젠쿱 유광 카본 센터페시아', wholesale: 154000, retail: 190000 },
  { id: 373, category: '제네시스쿠페', name: '젠쿱 유광 카본 도어 커버 트림', wholesale: 330000, retail: 450000 },
  { id: 374, category: '제네시스쿠페', name: '젠쿱 BK1 FRP 프론트 에어댐', wholesale: 440000, retail: 690000 },
  { id: 375, category: '제네시스쿠페', name: '젠쿱 디퍼런셜 강화 부싱', wholesale: 77000, retail: 99000 },
  { id: 376, category: '제네시스쿠페', name: '젠쿱 맴버 4포인트 강화 부싱', wholesale: 385000, retail: 520000 },
  { id: 377, category: '제네시스쿠페', name: '젠쿱 롱스트로크 리어 로워암', wholesale: 440000, retail: 580000 },
  { id: 378, category: '제네시스쿠페', name: '젠쿱 알루미늄 경량 전면레일 레드', wholesale: 230000, retail: 280000 },
  { id: 379, category: '제네시스쿠페', name: '젠쿱 전면 스틸 레일 레드', wholesale: 176000, retail: 210000 },
  { id: 380, category: '제네시스쿠페', name: '얼스 브레이크 호스 1조', wholesale: 66000, retail: 85000 },
  { id: 381, category: '제네시스쿠페', name: '젠쿱 리어멤버 부싱', wholesale: 130000, retail: 174000 },
  { id: 382, category: '제네시스쿠페', name: '젠쿱38 오일쿨러 캔필터변환 어댑터', wholesale: 330000, retail: 380000 },
  { id: 383, category: '제네시스쿠페', name: '클러치 유격조절', wholesale: 110000, retail: 150000 },
  { id: 384, category: '제네시스쿠페', name: '젠쿱 frp루프', wholesale: 440000, retail: 550000 },
  { id: 385, category: '제네시스쿠페', name: '젠쿱 리어 너클 볼 부싱 4개', wholesale: 200000, retail: 240000 },
  { id: 386, category: '제네시스쿠페', name: '젠쿱 로워 암 볼 부싱 2개', wholesale: 140000, retail: 180000 },
  { id: 387, category: '제네시스쿠페', name: '젠쿱 상부 암 볼 부싱 2개', wholesale: 140000, retail: 180000 },
  { id: 388, category: '제네시스쿠페', name: '젠쿱 토우 암 볼 부싱 2개', wholesale: 140000, retail: 180000 },
  { id: 389, category: '제네시스쿠페', name: '젠쿱 트레일링 암 볼 부싱 2개', wholesale: 100000, retail: 120000 },
  { id: 390, category: '제네시스쿠페', name: '젠쿱 어퍼 암 볼 부싱 2개', wholesale: 100000, retail: 120000 },
  { id: 391, category: '제네시스쿠페', name: '젠쿱 단조 피스톤 2.0', wholesale: 990000, retail: 1200000 },
  { id: 392, category: '제네시스쿠페', name: '젠쿱 단조 피스톤 3.8', wholesale: 1485000, retail: 1770000 },
  { id: 393, category: '제네시스쿠페', name: '젠쿱 단조 컨로드 2.0', wholesale: 660000, retail: 850000 },
  { id: 394, category: '제네시스쿠페', name: '젠쿱 단조 컨로드 3.8', wholesale: 990000, retail: 1200000 },
  
  // IRP (6개)
  { id: 395, category: 'IRP', name: 'IRP 기어봉 젠쿱 전용', wholesale: 950000, retail: 1150000 },
  { id: 396, category: 'IRP', name: 'IRP 기어봉 도요타 GT86 전용', wholesale: 800000, retail: 990000 },
  { id: 397, category: 'IRP', name: 'IRP 기어봉 닛산 350z 전용', wholesale: 800000, retail: 1000000 },
  { id: 398, category: 'IRP', name: 'IRP 유압 사이드 레버', wholesale: 550000, retail: 640000 },
  { id: 399, category: 'IRP', name: 'IRP X 번웨이 퀵 쉬프터', wholesale: 850000, retail: 1050000 },
  { id: 400, category: 'IRP', name: 'IRP X 번웨이 유압사이드', wholesale: 690000, retail: 830000 },
  
  // EDEL/BOV (6개)
  { id: 401, category: 'EDEL/BOV', name: 'EDEL 클러치 (2.0/3.8)', wholesale: 1650000, retail: 2150000 },
  { id: 402, category: 'EDEL/BOV', name: 'SM6 TCE 터보 BOV 어댑터', wholesale: 77000, retail: 149000 },
  { id: 403, category: 'EDEL/BOV', name: '유니버셜 타입 BOV 어댑터', wholesale: 22000, retail: 40000 },
  { id: 404, category: 'EDEL/BOV', name: 'BOV 사다리꼴 2.0T 2.5T', wholesale: 44000, retail: 55000 },
  { id: 405, category: 'EDEL/BOV', name: 'BOV 사각형 1.6T 3.3T', wholesale: 44000, retail: 55000 },
  { id: 406, category: 'EDEL/BOV', name: 'BOV 삼각형 (구쿱/K5터보)', wholesale: 33000, retail: 50000 },
  
  // 기타튜닝 (20개)
  { id: 407, category: '기타튜닝', name: '아반떼 AD스포츠 프론트 그릴', wholesale: 143000, retail: 198000 },
  { id: 408, category: '기타튜닝', name: '드리프트 전용 PM휠', wholesale: 900000, retail: 1200000 },
  { id: 409, category: '기타튜닝', name: '젠쿱 6점식 롤 케이지', wholesale: 1690000, retail: 1990000 },
  { id: 410, category: '기타튜닝', name: '아반떼N 4점식 롤케이지', wholesale: 891000, retail: 990000 },
  { id: 411, category: '기타튜닝', name: '벨로스터 JS/N FRP 4도어', wholesale: 1701000, retail: 1890000 },
  { id: 412, category: '기타튜닝', name: '현대/기아 번웨이 단조 휠 너트', wholesale: 157250, retail: 185000 },
  { id: 413, category: '기타튜닝', name: '번웨이 젠쿱 시트 브라켓 낱개', wholesale: 97750, retail: 115000 },
  { id: 414, category: '기타튜닝', name: '번웨이 타이어 렉 조립식', wholesale: 467500, retail: 550000 },
  { id: 415, category: '기타튜닝', name: '번웨이 오픈흡기 필터', wholesale: 55000, retail: 89000 },
  { id: 416, category: '기타튜닝', name: '벨로N 아반떼N 코나N 다운파이프', wholesale: 595000, retail: 700000 },
  { id: 417, category: '기타튜닝', name: '아반떼N 벨로N 터보라인 강화 호스', wholesale: 242250, retail: 285000 },
  { id: 418, category: '기타튜닝', name: '유니버셜 알루미늄 소화기 브라켓', wholesale: 84150, retail: 99000 },
  { id: 419, category: '기타튜닝', name: '현대/기아 N 버킷시트 브라켓', wholesale: 84150, retail: 99000 },
  { id: 420, category: '기타튜닝', name: '번웨이 젠쿱 시트 브라켓 V2 낱개', wholesale: 97750, retail: 115000 },
  { id: 421, category: '기타튜닝', name: '번웨이 버킷 사이드 마운트 브라켓', wholesale: 72250, retail: 85000 },
  { id: 422, category: '기타튜닝', name: '번웨이 유압식 사이드 레버', wholesale: 127500, retail: 150000 },
  { id: 423, category: '기타튜닝', name: '젠쿱 번웨이 유압사이드+브라켓 세트', wholesale: 238000, retail: 280000 },
  { id: 424, category: '기타튜닝', name: '젠쿱 번웨이 유압사이드 리어캘리퍼 풀세트', wholesale: 1275000, retail: 1500000 },
  { id: 425, category: '기타튜닝', name: '젠쿱 IRP유압사이드+번웨이+리어캘리퍼 풀세트', wholesale: 1700000, retail: 2000000 },
  { id: 426, category: '기타튜닝', name: '벨로N 아반떼N 코나N 터보 인렛 70/80', wholesale: 130000, retail: 160000 },
  { id: 427, category: '기타튜닝', name: '벨로N 아반떼N 코나N 터보 인렛+실리콘호스', wholesale: 161500, retail: 190000 },
  
  // HKS (4개)
  { id: 428, category: 'HKS', name: 'HKS 점화 플러그 M45 XL', wholesale: 33000, retail: 39000 },
  { id: 429, category: 'HKS', name: 'HKS 점화 플러그 M45 IL', wholesale: 30000, retail: 34000 },
  { id: 430, category: 'HKS', name: 'HKS BOV 밸브 SQV 블랙', wholesale: 265000, retail: 350000 },
  { id: 431, category: 'HKS', name: 'HKS 오픈흡기 200-80/200-100', wholesale: 150000, retail: 198000 },
  
  // N전용/엔진 (2개)
  { id: 432, category: 'N전용/엔진', name: 'N 전용 단조 컨로드', wholesale: 660000, retail: 850000 },
  { id: 433, category: 'N전용/엔진', name: 'N 전용 단조 피스톤', wholesale: 990000, retail: 1200000 },
  
  // 타이어 (4개)
  { id: 434, category: '타이어', name: '링롱 플래시히어로 265 35 18', wholesale: 121000, retail: 155000 },
  { id: 435, category: '타이어', name: '링롱 플래시히어로 285 35 19', wholesale: 140000, retail: 175000 },
  { id: 436, category: '타이어', name: '링롱 스포츠마스터 245 40 18', wholesale: 79000, retail: 95000 },
  { id: 437, category: '타이어', name: '링롱 스포츠마스터 265 35 18', wholesale: 84000, retail: 99000 },
  
  // 캔슬러 (2개)
  { id: 438, category: '캔슬러', name: 'BMW 캔슬러', wholesale: 22000, retail: 33000 },
  { id: 439, category: '캔슬러', name: '캔슬러', wholesale: 22000, retail: 33000 },
];

const categories = [...new Set(priceData.map(item => item.category))];

// 모든 제품에 기본 재고 50개 설정
priceData.forEach(item => {
  if (item.stock === undefined) item.stock = 50;
  if (item.min_stock === undefined) item.min_stock = 5;
});

const formatPrice = (price) => {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('ko-KR').format(Math.round(price)) + '원';
};

// 부가세 제외 금액 계산
const calcExVat = (price) => Math.round(price / 1.1);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const STORAGE_KEY = 'pos-orders-shared';

// 주문 상세 보기 모달
function OrderDetailModal({ isOpen, onClose, order, formatPrice }) {
  const [copied, setCopied] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const exVat = calcExVat(order.totalAmount);
  const vat = order.totalAmount - exVat;

  const generateOrderText = () => {
    let text = `═══════════════════════════════════\n`;
    text += `           주 문 서\n`;
    text += `═══════════════════════════════════\n\n`;
    text += `주문번호: ${order.orderNumber}\n`;
    text += `주문일자: ${formatDate(order.createdAt)}\n`;
    if (order.customerName) text += `고객명: ${order.customerName}\n`;
    if (order.customerPhone) text += `연락처: ${order.customerPhone}\n`;
    text += `단가기준: ${order.priceType === 'wholesale' ? '도매가 (부가세 포함)' : '소비자가 (부가세 포함)'}\n\n`;
    text += `───────────────────────────────────\n`;
    text += `상품 목록\n`;
    text += `───────────────────────────────────\n\n`;
    
    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name}\n`;
      text += `   ${formatPrice(item.price)} × ${item.quantity}개 = ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    text += `───────────────────────────────────\n`;
    text += `총 수량: ${totalQuantity}개\n`;
    text += `───────────────────────────────────\n`;
    text += `공급가액: ${formatPrice(exVat)}\n`;
    text += `부가세: ${formatPrice(vat)}\n`;
    text += `총 금액: ${formatPrice(order.totalAmount)}\n`;
    text += `───────────────────────────────────\n`;
    
    if (order.memo) text += `\n메모: ${order.memo}\n`;
    
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>주문서 - ${order.orderNumber}</title>
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .info { margin: 20px 0; }
            .info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
            .total { font-size: 16px; text-align: right; margin-top: 20px; }
            .total p { margin: 5px 0; }
            .total .grand { font-size: 20px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .memo { margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>주 문 서</h1>
          <div class="info">
            <p><strong>주문번호:</strong> ${order.orderNumber}</p>
            <p><strong>주문일자:</strong> ${formatDate(order.createdAt)}</p>
            ${order.customerName ? `<p><strong>고객명:</strong> ${order.customerName}</p>` : ''}
            ${order.customerPhone ? `<p><strong>연락처:</strong> ${order.customerPhone}</p>` : ''}
            <p><strong>단가기준:</strong> ${order.priceType === 'wholesale' ? '도매가' : '소비자가'}</p>
          </div>
          <table>
            <thead><tr><th>No</th><th>상품명</th><th>단가</th><th>수량</th><th>금액</th></tr></thead>
            <tbody>
              ${order.items.map((item, index) => `
                <tr><td>${index + 1}</td><td>${item.name}</td><td>${formatPrice(item.price)}</td><td>${item.quantity}</td><td>${formatPrice(item.price * item.quantity)}</td></tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>총 수량: ${totalQuantity}개</p>
            <p>공급가액: ${formatPrice(exVat)}</p>
            <p>부가세(10%): ${formatPrice(vat)}</p>
            <p class="grand">총 금액: ${formatPrice(order.totalAmount)}</p>
          </div>
          ${order.memo ? `<div class="memo"><strong>메모:</strong> ${order.memo}</div>` : ''}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">주문 상세</h2>
              <p className="text-emerald-100 text-sm">{order.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors btn-ripple">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] category-scroll overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="p-6 border-b border-slate-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">주문일시:</span>
                <span className="text-white ml-2">{formatDateTime(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-slate-400">단가기준:</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  order.priceType === 'wholesale' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {order.priceType === 'wholesale' ? '도매가' : '소비자가'}
                </span>
              </div>
              {order.customerName && (
                <div>
                  <span className="text-slate-400">고객명:</span>
                  <span className="text-white ml-2">{order.customerName}</span>
                </div>
              )}
              {order.customerPhone && (
                <div>
                  <span className="text-slate-400">연락처:</span>
                  <span className="text-white ml-2">{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              주문 상품 ({order.items.length}종)
            </h3>
            
            <div className="bg-slate-900/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-700/50 text-slate-300 text-sm font-medium">
                <div className="col-span-1">No</div>
                <div className="col-span-5">상품명</div>
                <div className="col-span-2 text-right">단가</div>
                <div className="col-span-2 text-center">수량</div>
                <div className="col-span-2 text-right">금액</div>
              </div>
              
              <div className="divide-y divide-slate-700/50">
                {order.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
                    <div className="col-span-1 text-slate-400">{index + 1}</div>
                    <div className="col-span-5 text-white truncate">{item.name}</div>
                    <div className="col-span-2 text-right text-slate-300">{formatPrice(item.price)}</div>
                    <div className="col-span-2 text-center text-white">{item.quantity}개</div>
                    <div className="col-span-2 text-right text-emerald-400 font-medium">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {order.memo && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm">메모: </span>
                <span className="text-white text-sm">{order.memo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-700 p-6 bg-slate-900/50">
          <div className="flex items-start justify-between mb-4">
            <div className="text-slate-400 text-sm space-y-1">
              <p>총 수량: <span className="text-white font-medium">{totalQuantity}개</span></p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 space-y-1 mb-2">
                <p>공급가액: <span className="text-slate-300">{formatPrice(exVat)}</span></p>
                <p>부가세: <span className="text-slate-300">{formatPrice(vat)}</span></p>
              </div>
              <p className="text-2xl font-bold text-white">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {copied ? <><Check className="w-5 h-5" />복사됨!</> : <><Copy className="w-5 h-5" />복사하기</>}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-5 h-5" />인쇄하기
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 저장된 장바구니 모달 ====================
function SavedCartsModal({ isOpen, onClose, savedCarts, onLoad, onDelete, formatPrice }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl border border-slate-700 animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">저장된 장바구니</h2>
            <span className="text-violet-200 text-sm">({savedCarts.length}개)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)] overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
          {savedCarts.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">저장된 장바구니가 없습니다</p>
              <p className="text-slate-500 text-sm mt-1">장바구니를 저장하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCarts.map((cart, index) => (
                <div key={index} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{cart.name}</h3>
                      <p className="text-slate-400 text-xs">{cart.date} {cart.time}</p>
                    </div>
                    <p className="text-emerald-400 font-bold">{formatPrice(cart.total)}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-2 mb-3">
                    <p className="text-slate-400 text-sm truncate">
                      {cart.items.map(item => `${item.name}(${item.quantity})`).join(', ')}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{cart.items.length}종 / {cart.items.reduce((sum, item) => sum + item.quantity, 0)}개</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { onLoad(cart); onClose(); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      불러오기
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(index)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {deleteConfirm === index && (
                    <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-600/30">
                      <p className="text-red-400 text-sm mb-2">정말 삭제하시겠습니까?</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { onDelete(index); setDeleteConfirm(null); }}
                          className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 rounded text-white text-sm"
                        >
                          삭제
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 py-1.5 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-slate-900 px-6 py-4">
          <button onClick={onClose} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 장바구니 저장 모달 ====================
// ==================== 거래처 목록 모달 ====================
function CustomerListModal({ isOpen, onClose, customers, orders = [], formatPrice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 거래처
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { 
      if (e.key === 'Escape') {
        if (selectedCustomer) {
          setSelectedCustomer(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, selectedCustomer]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCustomer(null);
      setSearchTerm('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // 검색 필터링
  const filteredCustomers = (customers || []).filter(c => 
    c.name.toLowerCase().replace(/\s/g, '').includes(searchTerm.toLowerCase().replace(/\s/g, '')) ||
    (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone && c.phone.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, '')))
  );

  // 거래처별 주문 이력 가져오기
  const getCustomerOrders = (customerName) => {
    return (orders || []).filter(order => 
      order.customerName && 
      order.customerName.toLowerCase().replace(/\s/g, '') === customerName.toLowerCase().replace(/\s/g, '')
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // 거래처별 총 주문 금액
  const getCustomerTotalAmount = (customerName) => {
    const customerOrders = getCustomerOrders(customerName);
    return customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onWheel={(e) => e.stopPropagation()}>
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col shadow-2xl animate-scale-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedCustomer ? (
              <button onClick={() => setSelectedCustomer(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedCustomer ? selectedCustomer.name : '거래처 목록'}
              </h2>
              <p className="text-emerald-100 text-sm">
                {selectedCustomer 
                  ? `주문 ${getCustomerOrders(selectedCustomer.name).length}건 / 총 ${formatPrice(getCustomerTotalAmount(selectedCustomer.name))}`
                  : `총 ${customers?.length || 0}개 업체`
                }
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {selectedCustomer ? (
          /* 거래처 주문 이력 */
          <>
            {/* 거래처 정보 */}
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex flex-wrap gap-4 text-sm">
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="flex items-center gap-2 flex-1">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 주문 이력 */}
            <div className="overflow-y-auto flex-1 p-4 mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
              {getCustomerOrders(selectedCustomer.name).length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">주문 이력이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getCustomerOrders(selectedCustomer.name).map(order => (
                    <div key={order.orderNumber} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{formatDate(order.createdAt)}</span>
                        <span className="text-emerald-400 font-bold">{formatPrice(order.totalAmount)}</span>
                      </div>
                      <div className="space-y-1">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-300">{item.name} x{item.quantity}</span>
                            <span className="text-slate-400">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      {order.memo && (
                        <p className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-600">메모: {order.memo}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* 거래처 목록 */
          <>
            {/* 검색 */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="업체명, 주소, 전화번호로 검색..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">검색 결과: {filteredCustomers.length}개</p>
            </div>
            
            {/* 목록 */}
            <div className="overflow-y-auto flex-1 p-4 mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">등록된 거래처가 없습니다</p>
                  <p className="text-slate-500 text-sm mt-1">관리자 페이지에서 거래처를 추가하세요</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCustomers.map(customer => {
                    const orderCount = getCustomerOrders(customer.name).length;
                    const totalAmount = getCustomerTotalAmount(customer.name);
                    
                    return (
                      <div 
                        key={customer.id} 
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-emerald-500/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-semibold truncate">{customer.name}</h3>
                              {orderCount > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">
                                  {orderCount}건
                                </span>
                              )}
                            </div>
                            {customer.phone && (
                              <p className="text-emerald-400 text-sm flex items-center gap-1.5 mt-1">
                                <Phone className="w-3.5 h-3.5" />
                                {customer.phone}
                              </p>
                            )}
                            {customer.address && (
                              <p className="text-slate-400 text-sm flex items-start gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span className="truncate">{customer.address}</span>
                              </p>
                            )}
                            {totalAmount > 0 && (
                              <p className="text-blue-400 text-xs mt-2">
                                총 거래: {formatPrice(totalAmount)}
                              </p>
                            )}
                          </div>
                          <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 rotate-180 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* 하단 버튼 */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={() => selectedCustomer ? setSelectedCustomer(null) : onClose()}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
          >
            {selectedCustomer ? '← 목록으로' : '닫기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 택배 송장 생성 모달 ====================
function ShippingLabelModal({ isOpen, onClose, orders = [], customers = [], formatPrice }) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [defaultShippingCost, setDefaultShippingCost] = useState(7300);
  const [senderName, setSenderName] = useState('무브모터스');
  const [dateFilter, setDateFilter] = useState('all');
  const [orderSettings, setOrderSettings] = useState({});
  
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) {
      setSelectedOrders([]);
      setOrderSettings({});
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const safeOrders = orders || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const filteredOrders = safeOrders.filter(order => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    if (dateFilter === 'today') return orderDate.getTime() === today.getTime();
    if (dateFilter === 'yesterday') return orderDate.getTime() === yesterday.getTime();
    if (dateFilter === 'week') return orderDate >= weekAgo;
    return true;
  });
  
  const getOrderSetting = (orderNumber) => {
    return orderSettings[orderNumber] || { paymentType: '착불', packaging: '박스1', shippingCost: defaultShippingCost };
  };
  
  const updateOrderSetting = (orderNumber, field, value) => {
    setOrderSettings(prev => ({ ...prev, [orderNumber]: { ...getOrderSetting(orderNumber), [field]: value } }));
  };
  
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) setSelectedOrders([]);
    else setSelectedOrders(filteredOrders.map(o => o.orderNumber));
  };
  
  const toggleOrder = (orderNumber) => {
    setSelectedOrders(prev => prev.includes(orderNumber) ? prev.filter(o => o !== orderNumber) : [...prev, orderNumber]);
  };
  
  const findCustomer = (name) => {
    if (!name) return null;
    return (customers || []).find(c => c.name && c.name.toLowerCase().replace(/\s/g, '') === name.toLowerCase().replace(/\s/g, ''));
  };
  
  const getMostExpensiveItem = (items) => {
    if (!items || items.length === 0) return '상품';
    return items.reduce((max, item) => item.price > max.price ? item : max, items[0]).name;
  };
  
  const generateShippingLabel = () => {
    if (selectedOrders.length === 0) return;
    const selectedData = filteredOrders.filter(o => selectedOrders.includes(o.orderNumber));
    let csv = '\uFEFF';
    csv += '보내는곳 : ' + senderName + '\n';
    csv += '번호,받는곳,배송,포장,운임,품명,연락처\n';
    selectedData.forEach((order, index) => {
      const customer = findCustomer(order.customerName);
      const mostExpensive = getMostExpensiveItem(order.items);
      const phone = customer?.phone || order.customerPhone || '';
      const address = customer?.address || '';
      const setting = getOrderSetting(order.orderNumber);
      csv += `${index + 1},${order.customerName},${setting.paymentType},${setting.packaging},${setting.shippingCost},${mostExpensive},${phone}\n`;
      if (address) csv += `${address}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `택배송장_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const generateXlsxLabel = async () => {
    if (selectedOrders.length === 0) return;
    const selectedData = filteredOrders.filter(o => selectedOrders.includes(o.orderNumber));
    if (!window.ExcelJS) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    const ExcelJS = window.ExcelJS;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('택배 송장');
    worksheet.columns = [{ width: 7.5 }, { width: 25.5 }, { width: 12.2 }, { width: 12.4 }, { width: 17.4 }, { width: 30.6 }, { width: 24.1 }];
    const thinBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells('A1:G1');
    const headerRow = worksheet.getRow(1);
    headerRow.getCell(1).value = '보내는곳 : ' + senderName;
    headerRow.getCell(1).font = { bold: true, size: 14 };
    headerRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.getCell(1).border = thinBorder;
    headerRow.height = 35;
    const headers = ['번호', '받는곳', '배송', '포장', '운임', '품명', '연락처'];
    const colHeaderRow = worksheet.getRow(2);
    headers.forEach((header, idx) => {
      const cell = colHeaderRow.getCell(idx + 1);
      cell.value = header;
      cell.font = { bold: true, size: 14 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = thinBorder;
    });
    colHeaderRow.height = 26;
    let rowNum = 3;
    selectedData.forEach((order, index) => {
      const customer = order.customerName ? findCustomer(order.customerName) : null;
      const mostExpensive = getMostExpensiveItem(order.items);
      const phone = customer?.phone || order.customerPhone || '';
      const address = customer?.address || '';
      const setting = getOrderSetting(order.orderNumber);
      const isPrepaid = setting.paymentType === '선불';
      const dataRow = worksheet.getRow(rowNum);
      const rowData = [index + 1, order.customerName || '', setting.paymentType, setting.packaging, setting.shippingCost, mostExpensive, phone];
      rowData.forEach((value, idx) => {
        const cell = dataRow.getCell(idx + 1);
        cell.value = value;
        cell.font = { size: 11, bold: isPrepaid };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = thinBorder;
      });
      dataRow.height = 38;
      rowNum++;
      if (address) {
        worksheet.mergeCells(`A${rowNum}:G${rowNum}`);
        const addrRow = worksheet.getRow(rowNum);
        addrRow.getCell(1).value = address;
        addrRow.getCell(1).font = { size: 11, bold: isPrepaid };
        addrRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        addrRow.getCell(1).border = thinBorder;
        addrRow.height = 30;
        rowNum++;
      }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `택배송장_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
  };
  
  const printShippingLabels = () => {
    if (selectedOrders.length === 0) return;
    const selectedData = filteredOrders.filter(o => selectedOrders.includes(o.orderNumber));
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>택배 송장</title><style>body{font-family:'Malgun Gothic',sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-bottom:30px}th,td{border:1px solid #000;padding:8px;text-align:center}th{background-color:#f0f0f0}.header{font-size:16px;font-weight:bold;text-align:center;padding:15px}.prepaid{font-weight:bold}@media print{body{padding:0}}</style></head><body><table><thead><tr><td colspan="7" class="header">보내는곳 : ${senderName}</td></tr><tr><th style="width:5%">번호</th><th style="width:20%">받는곳</th><th style="width:8%">배송</th><th style="width:10%">포장</th><th style="width:10%">운임</th><th style="width:32%">품명</th><th style="width:15%">연락처</th></tr></thead><tbody>`;
    selectedData.forEach((order, index) => {
      const customer = findCustomer(order.customerName);
      const mostExpensive = getMostExpensiveItem(order.items);
      const phone = customer?.phone || order.customerPhone || '';
      const address = customer?.address || '';
      const setting = getOrderSetting(order.orderNumber);
      const isPrepaid = setting.paymentType === '선불';
      const rowClass = isPrepaid ? 'prepaid' : '';
      html += `<tr class="${rowClass}"><td>${index + 1}</td><td>${order.customerName || ''}</td><td>${setting.paymentType}</td><td>${setting.packaging}</td><td>${setting.shippingCost}</td><td>${mostExpensive}</td><td>${phone}</td></tr>`;
      if (address) html += `<tr class="${rowClass}"><td colspan="7">${address}</td></tr>`;
    });
    html += `</tbody></table><script>window.onload = function() { window.print(); }</script></body></html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
  };
  
  const packagingOptions = ['박스1', '박스2', '박스3', '나체1', '나체2', '나체3'];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">택배 송장 생성</h2>
              <p className="text-orange-100 text-sm">전체 주문 {safeOrders.length}건 / 필터 {filteredOrders.length}건</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>
        
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex gap-2 mb-4">
            {[{ key: 'today', label: '오늘' }, { key: 'yesterday', label: '어제' }, { key: 'week', label: '최근 7일' }, { key: 'all', label: '전체' }].map(({ key, label }) => (
              <button key={key} onClick={() => { setDateFilter(key); setSelectedOrders([]); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dateFilter === key ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{label}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">보내는 곳</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">기본 택배비</label>
              <input type="number" value={defaultShippingCost} onChange={(e) => setDefaultShippingCost(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-orange-500 focus:ring-orange-500" />
              <span className="text-slate-300 text-sm">전체 선택</span>
            </label>
            <span className="text-orange-400 font-semibold">{selectedOrders.length}건 선택됨</span>
          </div>
          
          <div className="overflow-y-auto max-h-[40vh] space-y-2 overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">해당 기간 주문 내역이 없습니다</p>
                <p className="text-slate-500 text-sm mt-1">다른 날짜 필터를 선택해보세요</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const customer = order.customerName ? findCustomer(order.customerName) : null;
                const hasAddress = customer?.address;
                const setting = getOrderSetting(order.orderNumber);
                const isSelected = selectedOrders.includes(order.orderNumber);
                
                return (
                  <div key={order.orderNumber} className={`rounded-lg border transition-all ${isSelected ? 'bg-orange-600/20 border-orange-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}>
                    <div className="p-3 cursor-pointer" onClick={() => toggleOrder(order.orderNumber)}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => {}} className="mt-1 w-4 h-4 rounded border-slate-500 bg-slate-700 text-orange-500" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${setting.paymentType === '선불' ? 'text-yellow-400 font-bold' : 'text-white'}`}>{order.customerName || '고객명 없음'}</span>
                            {setting.paymentType === '선불' && <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 text-xs rounded-full font-bold">선불</span>}
                            {hasAddress ? <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">주소 있음</span> : <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded-full">주소 없음</span>}
                          </div>
                          <p className="text-slate-400 text-sm truncate">{customer?.address || '주소 미등록'}</p>
                          <p className="text-slate-500 text-xs mt-1">{order.items?.length || 0}종 · {formatPrice(order.totalAmount)}</p>
                        </div>
                        <div className="text-right"><p className="text-slate-400 text-xs">{customer?.phone || order.customerPhone || '번호 없음'}</p></div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="px-3 pb-3 pt-2 border-t border-slate-600/50" onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">배송 방식</label>
                            <select value={setting.paymentType} onChange={(e) => updateOrderSetting(order.orderNumber, 'paymentType', e.target.value)} className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:border-orange-500">
                              <option value="착불">착불</option>
                              <option value="선불">선불</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">포장</label>
                            <input 
                              type="text"
                              list={`packaging-options-${order.orderNumber}`}
                              value={setting.packaging} 
                              onChange={(e) => updateOrderSetting(order.orderNumber, 'packaging', e.target.value)} 
                              placeholder="박스1"
                              className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                            />
                            <datalist id={`packaging-options-${order.orderNumber}`}>
                              {packagingOptions.map(opt => <option key={opt} value={opt} />)}
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">택배비</label>
                            <input type="number" value={setting.shippingCost} onChange={(e) => updateOrderSetting(order.orderNumber, 'shippingCost', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:border-orange-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700 space-y-2">
          <div className="flex gap-2">
            <button onClick={generateShippingLabel} disabled={selectedOrders.length === 0} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${selectedOrders.length === 0 ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}><Download className="w-5 h-5" />CSV</button>
            <button onClick={generateXlsxLabel} disabled={selectedOrders.length === 0} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${selectedOrders.length === 0 ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}><FileText className="w-5 h-5" />Excel</button>
            <button onClick={printShippingLabels} disabled={selectedOrders.length === 0} className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${selectedOrders.length === 0 ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-white'}`}><Printer className="w-5 h-5" />인쇄</button>
          </div>
          <button onClick={onClose} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}

// ==================== 재고 현황 모달 ====================
function StockOverviewModal({ isOpen, onClose, products, categories, formatPrice }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [stockFilter, setStockFilter] = useState('all'); // all, normal, low, out
  const [searchTerm, setSearchTerm] = useState('');
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // 필터링된 제품
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().replace(/\s/g, '').includes(searchTerm.toLowerCase().replace(/\s/g, ''));
    const stock = p.stock ?? 50;
    const minStock = p.min_stock || 5;
    
    let matchesStock = true;
    if (stockFilter === 'out') matchesStock = stock === 0;
    else if (stockFilter === 'low') matchesStock = stock > 0 && stock <= minStock;
    else if (stockFilter === 'normal') matchesStock = stock > minStock;
    
    return matchesCategory && matchesSearch && matchesStock;
  });
  
  // 통계 계산
  const stats = {
    total: products.length,
    normal: products.filter(p => (p.stock ?? 50) > (p.min_stock || 5)).length,
    low: products.filter(p => (p.stock ?? 50) > 0 && (p.stock ?? 50) <= (p.min_stock || 5)).length,
    out: products.filter(p => (p.stock ?? 50) === 0).length
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" data-lenis-prevent="true">
      <div className="bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in" data-lenis-prevent="true">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">재고 현황</h2>
              <p className="text-cyan-100 text-sm">전체 {products.length}개 제품</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* 재고 통계 카드 (클릭 가능) */}
        <div className="p-3 sm:p-4 border-b border-slate-700">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            <button onClick={() => setStockFilter('all')} className={`rounded-xl p-2 sm:p-3 text-center transition-all ${stockFilter === 'all' ? 'ring-2 ring-white bg-slate-700' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
              <p className="text-slate-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1">전체</p>
              <p className="text-base sm:text-xl font-bold text-white">{stats.total}</p>
            </button>
            <button onClick={() => setStockFilter('normal')} className={`rounded-xl p-2 sm:p-3 text-center transition-all ${stockFilter === 'normal' ? 'ring-2 ring-emerald-400 bg-emerald-600/30' : 'bg-emerald-600/20 hover:bg-emerald-600/30'}`}>
              <p className="text-emerald-300 text-[10px] sm:text-xs mb-0.5 sm:mb-1">정상</p>
              <p className="text-base sm:text-xl font-bold text-emerald-400">{stats.normal}</p>
            </button>
            <button onClick={() => setStockFilter('low')} className={`rounded-xl p-2 sm:p-3 text-center transition-all ${stockFilter === 'low' ? 'ring-2 ring-yellow-400 bg-yellow-600/30' : 'bg-yellow-600/20 hover:bg-yellow-600/30'}`}>
              <p className="text-yellow-300 text-[10px] sm:text-xs mb-0.5 sm:mb-1">부족</p>
              <p className="text-base sm:text-xl font-bold text-yellow-400">{stats.low}</p>
            </button>
            <button onClick={() => setStockFilter('out')} className={`rounded-xl p-2 sm:p-3 text-center transition-all ${stockFilter === 'out' ? 'ring-2 ring-red-400 bg-red-600/30' : 'bg-red-600/20 hover:bg-red-600/30'}`}>
              <p className="text-red-300 text-[10px] sm:text-xs mb-0.5 sm:mb-1">품절</p>
              <p className="text-base sm:text-xl font-bold text-red-400">{stats.out}</p>
            </button>
          </div>
        </div>
        
        {/* 카테고리 필터 & 검색 */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setSelectedCategory('전체')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === '전체' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              전체
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제품 검색..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        
        {/* 제품 목록 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-320px)] overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
          <p className="text-slate-400 text-sm mb-3">
            {selectedCategory !== '전체' && <span className="text-cyan-400">{selectedCategory}</span>}
            {selectedCategory !== '전체' && ' · '}
            검색 결과: <span className="text-white font-semibold">{filteredProducts.length}개</span>
          </p>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">해당 조건의 제품이 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredProducts.map(product => {
                const stock = product.stock ?? 50;
                const minStock = product.min_stock || 5;
                const isOut = stock === 0;
                const isLow = stock > 0 && stock <= minStock;
                
                return (
                  <div 
                    key={product.id} 
                    className={`rounded-lg p-3 border ${
                      isOut ? 'bg-red-900/20 border-red-500/30' :
                      isLow ? 'bg-yellow-900/20 border-yellow-500/30' :
                      'bg-emerald-900/10 border-emerald-500/20'
                    }`}
                  >
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-slate-400 text-xs truncate">{product.category}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isOut ? 'bg-red-600/30 text-red-400' :
                        isLow ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-emerald-600/30 text-emerald-400'
                      }`}>
                        {isOut ? '품절' : `${stock}개`}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">{formatPrice(product.wholesale)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveCartModal({ isOpen, onClose, onSave, cart, priceType, formatPrice, customerName = '' }) {
  const [cartName, setCartName] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // 고객명이 있으면 고객명으로, 없으면 날짜로
      if (customerName && customerName.trim()) {
        setCartName(customerName.trim());
      } else {
        const now = new Date();
        const defaultName = `${now.getMonth() + 1}월 ${now.getDate()}일 ${now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
        setCartName(defaultName);
      }
    }
  }, [isOpen, customerName]);
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const total = cart.reduce((sum, item) => {
    const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
    return sum + (price * item.quantity);
  }, 0);
  
  const handleSave = () => {
    if (!cartName.trim()) return;
    onSave(cartName.trim());
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">장바구니 저장</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">저장 이름</label>
            <input
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="고객명 또는 저장명 입력"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">상품</span>
              <span className="text-white">{cart.length}종 / {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">합계</span>
              <span className="text-emerald-400 font-bold text-lg">{formatPrice(total)}</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
            <p className="text-slate-400 text-sm">
              {cart.map(item => `${item.name}(${item.quantity})`).join(', ')}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-900 px-6 py-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={!cartName.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
          >
            <Save className="w-5 h-5" />
            저장하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 텍스트 분석 모달 (AI 주문 인식) ====================
function TextAnalyzeModal({ isOpen, onClose, products, onAddToCart, formatPrice, priceType, initialText = '' }) {
  const [inputText, setInputText] = useState('');
  const [analyzedItems, setAnalyzedItems] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchingIndex, setSearchingIndex] = useState(null); // 검색 중인 항목 인덱스
  const [searchQuery, setSearchQuery] = useState('');

  // initialText가 있으면 자동으로 입력
  useEffect(() => {
    if (isOpen && initialText) {
      setInputText(initialText);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  // 텍스트 분석 함수
  const analyzeText = () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setSearchingIndex(null);
    const lines = inputText.split('\n').filter(line => line.trim());
    const results = [];

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // 수량 추출 (숫자 + 개/세트/ea 등)
      const qtyPatterns = [
        /(\d+)\s*개/,
        /(\d+)\s*세트/,
        /(\d+)\s*ea/i,
        /(\d+)\s*EA/,
        /(\d+)\s*$/, // 줄 끝의 숫자
        /^(\d+)\s+/, // 줄 시작의 숫자
        /[x×]\s*(\d+)/i, // x3, ×2 형태
      ];

      let quantity = 1;
      let searchText = cleanLine;

      for (const pattern of qtyPatterns) {
        const match = cleanLine.match(pattern);
        if (match) {
          quantity = parseInt(match[1]) || 1;
          searchText = cleanLine.replace(pattern, '').trim();
          break;
        }
      }

      // 검색 텍스트 정리 (숫자, 특수문자 등)
      searchText = searchText
        .replace(/[,.\-_\/\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!searchText) return;

      // 제품 매칭 (키워드 기반)
      const keywords = searchText.toLowerCase().split(' ').filter(k => k.length > 0);
      
      let bestMatch = null;
      let bestScore = 0;

      products.forEach(product => {
        const productName = product.name.toLowerCase();
        let score = 0;

        // 각 키워드가 제품명에 포함되는지 확인
        keywords.forEach(keyword => {
          if (productName.includes(keyword)) {
            score += keyword.length; // 긴 키워드일수록 높은 점수
          }
        });

        // 전체 검색어가 포함되면 보너스
        if (productName.includes(searchText.toLowerCase())) {
          score += 10;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = product;
        }
      });

      results.push({
        originalText: cleanLine,
        searchText,
        quantity,
        matchedProduct: bestMatch,
        score: bestScore,
        selected: bestScore > 0 // 매칭된 것만 기본 선택
      });
    });

    setAnalyzedItems(results);
    setIsAnalyzing(false);
  };

  // 선택 토글
  const toggleSelect = (index) => {
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  // 수량 변경
  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: qty } : item
    ));
  };

  // 제품 수동 선택 (검색으로 찾은 제품)
  const selectProduct = (index, product) => {
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, matchedProduct: product, selected: true, score: 100 } : item
    ));
    setSearchingIndex(null);
    setSearchQuery('');
  };

  // 검색 결과 필터링 (띄어쓰기 무시)
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    // 띄어쓰기, 하이픈 등 제거하고 소문자로
    const query = searchQuery.toLowerCase().replace(/[\s\-_]/g, '');
    return products.filter(p => {
      const productName = p.name.toLowerCase().replace(/[\s\-_]/g, '');
      return productName.includes(query);
    }).slice(0, 8); // 최대 8개
  };

  // 장바구니에 담기
  const addSelectedToCart = () => {
    const selectedItems = analyzedItems.filter(item => item.selected && item.matchedProduct);
    selectedItems.forEach(item => {
      onAddToCart(item.matchedProduct, item.quantity);
    });
    onClose();
    setInputText('');
    setAnalyzedItems([]);
    setSearchingIndex(null);
    setSearchQuery('');
  };

  const selectedCount = analyzedItems.filter(item => item.selected && item.matchedProduct).length;
  const searchResults = getSearchResults();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in flex flex-col">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">AI 주문 인식</h2>
              <p className="text-purple-100 text-xs">메모를 붙여넣으면 자동으로 제품을 찾아드려요</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* 입력 영역 */}
          <div>
            <label className="block text-slate-300 text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              메모 입력 (줄 단위로 분석)
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`예시:
카본 93 듀얼 1세트
54파이 밴딩 45 6개
2m 환봉 1개 12파이
MVB 64 Y R 2개`}
              rows={6}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
            />
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={analyzeText}
            disabled={!inputText.trim() || isAnalyzing}
            className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              !inputText.trim() || isAnalyzing
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
            }`}
          >
            {isAnalyzing ? (
              <><RefreshCw className="w-5 h-5 animate-spin" />분석 중...</>
            ) : (
              <><Sparkles className="w-5 h-5" />텍스트 분석하기</>
            )}
          </button>

          {/* 분석 결과 */}
          {analyzedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  분석 결과 ({analyzedItems.length}줄)
                </h3>
                <span className="text-sm text-purple-400">{selectedCount}개 선택됨</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
                {analyzedItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-xl border transition-all ${
                      item.matchedProduct 
                        ? item.selected 
                          ? 'bg-purple-900/30 border-purple-500/50' 
                          : 'bg-slate-700/30 border-slate-600/50'
                        : 'bg-red-900/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* 체크박스 */}
                      <button
                        onClick={() => item.matchedProduct && toggleSelect(index)}
                        disabled={!item.matchedProduct}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          !item.matchedProduct 
                            ? 'border-slate-600 bg-slate-700 cursor-not-allowed'
                            : item.selected 
                              ? 'border-purple-500 bg-purple-500' 
                              : 'border-slate-500 hover:border-purple-400'
                        }`}
                      >
                        {item.selected && item.matchedProduct && <Check className="w-3 h-3 text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        {/* 원본 텍스트 */}
                        <p className="text-slate-400 text-xs mb-1 truncate">"{item.originalText}"</p>
                        
                        {item.matchedProduct ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium truncate">{item.matchedProduct.name}</p>
                                {/* 제품 변경 버튼 */}
                                <button
                                  onClick={() => { 
                                    setSearchingIndex(searchingIndex === index ? null : index); 
                                    setSearchQuery(item.searchText);
                                  }}
                                  className="px-2 py-0.5 text-xs bg-slate-600 hover:bg-purple-600 text-white rounded flex-shrink-0 transition-colors flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  변경
                                </button>
                              </div>
                              <p className={`text-sm ${priceType === 'wholesale' ? 'text-blue-400' : 'text-red-400'}`}>
                                {formatPrice(priceType === 'wholesale' ? item.matchedProduct.wholesale : (item.matchedProduct.retail || item.matchedProduct.wholesale))}
                              </p>
                            </div>
                            
                            {/* 수량 조절 */}
                            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 flex-shrink-0">
                              <button 
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-600 rounded"
                              >
                                <Minus className="w-3 h-3 text-white" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                className="w-10 h-6 text-center text-white text-sm font-bold bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button 
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-600 rounded"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* 매칭 실패 - 검색 UI */
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-red-400 text-sm">❌ 못 찾음</span>
                              <button
                                onClick={() => { 
                                  setSearchingIndex(searchingIndex === index ? null : index); 
                                  setSearchQuery(item.searchText);
                                }}
                                className="text-xs px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg flex items-center gap-1"
                              >
                                <Search className="w-3 h-3" />
                                직접 검색
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 검색 드롭다운 */}
                        {searchingIndex === index && (
                          <div className="mt-2 p-2 bg-slate-900 rounded-lg border border-slate-600" data-lenis-prevent="true">
                            <div className="relative mb-2">
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="제품명 검색..."
                                autoFocus
                                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            {searchResults.length > 0 ? (
                              <div className="max-h-40 overflow-y-auto space-y-1 mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
                                {searchResults.map(product => (
                                  <button
                                    key={product.id}
                                    onClick={() => selectProduct(index, product)}
                                    className="w-full p-2 text-left hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    <p className="text-white text-sm truncate">{product.name}</p>
                                    <p className={`text-xs ${priceType === 'wholesale' ? 'text-blue-400' : 'text-red-400'}`}>
                                      {formatPrice(priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale))}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            ) : searchQuery.trim() ? (
                              <p className="text-slate-500 text-sm text-center py-2">검색 결과 없음</p>
                            ) : (
                              <p className="text-slate-500 text-sm text-center py-2">검색어를 입력하세요</p>
                            )}
                            <button
                              onClick={() => { setSearchingIndex(null); setSearchQuery(''); }}
                              className="w-full mt-2 py-1.5 text-xs text-slate-400 hover:text-white"
                            >
                              닫기
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {analyzedItems.length > 0 && (
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <button
              onClick={addSelectedToCart}
              disabled={selectedCount === 0}
              className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                selectedCount === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {selectedCount}개 제품 장바구니에 담기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 주문 확인 모달
function OrderModal({ isOpen, onClose, cart, priceType, totalAmount, formatPrice, onSaveOrder, isSaving, onUpdateQuantity, onRemoveItem, onAddItem, products, onSaveCart, customers = [] }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 모달 열릴 때 body 스크롤 완전 잠금
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);

  // 모달이 열릴 때 한 번만 주문번호 생성
  useEffect(() => {
    if (isOpen && !orderNumber) {
      const today = new Date();
      const newOrderNumber = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      setOrderNumber(newOrderNumber);
    }
    // 모달이 닫힐 때 주문번호 초기화 (다음에 열릴 때 새로 생성)
    if (!isOpen) {
      setOrderNumber('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setMemo('');
      setCopied(false);
      setSaved(false);
      setSelectedCustomerId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 거래처 검색 결과
  const customerSuggestions = customerName.length >= 1
    ? customers.filter(c => 
        c.name.toLowerCase().replace(/\s/g, '').includes(customerName.toLowerCase().replace(/\s/g, ''))
      ).slice(0, 6)
    : [];

  // 거래처 선택
  const selectCustomer = (customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone || '');
    setCustomerAddress(customer.address || '');
    setSelectedCustomerId(customer.id);
    setShowCustomerSuggestions(false);
  };

  // 검색 결과 필터링
  const searchResults = productSearch.length >= 1 
    ? products.filter(p => 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const today = new Date();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // 실시간 총액 계산
  const currentTotal = cart.reduce((sum, item) => {
    const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
    return sum + (price * item.quantity);
  }, 0);
  const exVat = calcExVat(currentTotal);
  const vat = currentTotal - exVat;

  const generateOrderText = () => {
    let text = `═══════════════════════════════════\n`;
    text += `           주 문 서\n`;
    text += `═══════════════════════════════════\n\n`;
    text += `주문번호: ${orderNumber}\n`;
    text += `주문일자: ${formatDate(today.toISOString())}\n`;
    if (customerName) text += `고객명: ${customerName}\n`;
    if (customerPhone) text += `연락처: ${customerPhone}\n`;
    text += `단가기준: ${priceType === 'wholesale' ? '도매가 (부가세 포함)' : '소비자가 (부가세 포함)'}\n\n`;
    text += `───────────────────────────────────\n`;
    text += `상품 목록\n`;
    text += `───────────────────────────────────\n\n`;
    
    cart.forEach((item, index) => {
      const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
      text += `${index + 1}. ${item.name}\n`;
      text += `   ${formatPrice(price)} × ${item.quantity}개 = ${formatPrice(price * item.quantity)}\n\n`;
    });
    
    text += `───────────────────────────────────\n`;
    text += `총 수량: ${totalQuantity}개\n`;
    text += `───────────────────────────────────\n`;
    text += `공급가액: ${formatPrice(exVat)}\n`;
    text += `부가세: ${formatPrice(vat)}\n`;
    text += `총 금액: ${formatPrice(currentTotal)}\n`;
    text += `───────────────────────────────────\n`;
    
    if (memo) text += `\n메모: ${memo}\n`;
    
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleSave = async () => {
    if (cart.length === 0) return;
    
    const orderData = {
      orderNumber,
      createdAt: today.toISOString(),
      customerName,
      customerPhone,
      customerAddress,
      existingCustomerId: selectedCustomerId, // 기존 거래처면 ID 전달
      memo,
      priceType,
      totalAmount: currentTotal,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale),
        quantity: item.quantity
      }))
    };
    
    const success = await onSaveOrder(orderData);
    if (success) {
      const isNewCustomer = customerName && !selectedCustomerId && 
        !customers.find(c => c.name.toLowerCase().replace(/\s/g, '') === customerName.toLowerCase().replace(/\s/g, ''));
      
      let message = `✅ 주문이 저장되었습니다!\n\n주문번호: ${orderNumber}\n총 금액: ${formatPrice(currentTotal)}`;
      if (isNewCustomer) {
        message += `\n\n🆕 신규 거래처 "${customerName}"이(가) 자동 등록되었습니다.`;
      }
      alert(message);
      onClose();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>주문서 - ${orderNumber}</title>
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .info { margin: 20px 0; }
            .info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
            .total { font-size: 16px; text-align: right; margin-top: 20px; }
            .total p { margin: 5px 0; }
            .total .grand { font-size: 20px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .memo { margin-top: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>주 문 서</h1>
          <div class="info">
            <p><strong>주문번호:</strong> ${orderNumber}</p>
            <p><strong>주문일자:</strong> ${formatDate(today.toISOString())}</p>
            ${customerName ? `<p><strong>고객명:</strong> ${customerName}</p>` : ''}
            ${customerPhone ? `<p><strong>연락처:</strong> ${customerPhone}</p>` : ''}
            <p><strong>단가기준:</strong> ${priceType === 'wholesale' ? '도매가' : '소비자가'}</p>
          </div>
          <table>
            <thead><tr><th>No</th><th>상품명</th><th>단가</th><th>수량</th><th>금액</th></tr></thead>
            <tbody>
              ${cart.map((item, index) => {
                const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
                return `<tr><td>${index + 1}</td><td>${item.name}</td><td>${formatPrice(price)}</td><td>${item.quantity}</td><td>${formatPrice(price * item.quantity)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>총 수량: ${totalQuantity}개</p>
            <p>공급가액: ${formatPrice(exVat)}</p>
            <p>부가세(10%): ${formatPrice(vat)}</p>
            <p class="grand">총 금액: ${formatPrice(currentTotal)}</p>
          </div>
          ${memo ? `<div class="memo"><strong>메모:</strong> ${memo}</div>` : ''}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">주문서</h2>
              <p className="text-blue-100 text-sm">{orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 category-scroll overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }} onClick={() => { setShowSearchResults(false); setShowCustomerSuggestions(false); }}>
          <div className="p-5 border-b border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <label className="block text-slate-400 text-sm mb-1.5 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  고객명 / 업체명
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => { 
                    setCustomerName(e.target.value); 
                    setShowCustomerSuggestions(true);
                    setSelectedCustomerId(null);
                  }}
                  onFocus={() => setShowCustomerSuggestions(true)}
                  placeholder="고객명 또는 업체명 검색..."
                  className={`w-full px-4 py-2.5 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedCustomerId ? 'border-emerald-500' : 'border-slate-600'}`}
                />
                {selectedCustomerId && (
                  <span className="absolute right-3 top-9 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </span>
                )}
                {/* 신규 업체 표시 */}
                {customerName && !selectedCustomerId && !showCustomerSuggestions && customerSuggestions.length === 0 && (
                  <span className="absolute right-3 top-9 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                    🆕 신규
                  </span>
                )}
                {/* 거래처 자동완성 */}
                {showCustomerSuggestions && customerSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                    {customerSuggestions.map(customer => (
                      <button
                        key={customer.id}
                        onClick={() => selectCustomer(customer)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">{customer.name}</p>
                          {customer.phone && (
                            <span className="text-emerald-400 text-xs">{customer.phone}</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs truncate mt-0.5">{customer.address || '주소 미등록'}</p>
                      </button>
                    ))}
                  </div>
                )}
                {/* 검색 결과 없을 때 신규 등록 안내 */}
                {showCustomerSuggestions && customerName.length >= 2 && customerSuggestions.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-blue-500/50 rounded-lg shadow-xl p-4">
                    <p className="text-blue-400 text-sm flex items-center gap-2">
                      <span className="text-lg">🆕</span>
                      <span>"{customerName}" - 신규 업체로 자동 등록됩니다</span>
                    </p>
                    <p className="text-slate-500 text-xs mt-1">주문 저장 시 거래처 목록에 추가됩니다</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  연락처
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="연락처 입력"
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* 주소 필드 */}
            <div className="mt-3">
              <label className="block text-slate-400 text-sm mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                배송 주소
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="배송 주소 입력 (택배 발송시 필수)"
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">주문일자:</span>
                <span className="text-white">{formatDate(today.toISOString())}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">단가기준:</span>
                <span className={`px-2.5 py-1 rounded text-sm font-medium ${
                  priceType === 'wholesale' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {priceType === 'wholesale' ? '도매가' : '소비자가'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            {/* 제품 추가 검색 */}
            <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="제품 추가 검색..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
                {productSearch && (
                  <button 
                    onClick={() => {
                      setProductSearch('');
                      setShowSearchResults(false);
                    }}
                    className="p-0.5 hover:bg-slate-700 rounded"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
              
              {/* 검색 결과 드롭다운 */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto order-scroll">
                  {searchResults.map(product => {
                    const isInCart = cart.some(item => item.id === product.id);
                    const price = priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => {
                          if (!isInCart) {
                            onAddItem(product);
                            setProductSearch('');
                            setShowSearchResults(false);
                          }
                        }}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-0 ${isInCart ? 'opacity-50' : ''}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{product.name}</p>
                          <p className="text-slate-500 text-xs">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 text-sm font-medium">{formatPrice(price)}</span>
                          {isInCart ? (
                            <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">추가됨</span>
                          ) : (
                            <Plus className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              주문 상품 ({cart.length}종 / {totalQuantity}개)
            </h3>
            
            <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
              {/* PC 헤더 */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 bg-slate-700/50 text-slate-300 text-sm font-medium">
                <div className="col-span-5">상품명</div>
                <div className="col-span-2 text-right">단가</div>
                <div className="col-span-3 text-center">수량</div>
                <div className="col-span-2 text-right">금액</div>
              </div>
              
              <div className="divide-y divide-slate-700/50 max-h-64 overflow-y-auto order-scroll mobile-scroll" style={{ WebkitOverflowScrolling: 'touch' }}>
                {cart.map((item) => {
                  const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
                  return (
                    <div key={item.id} className="px-3 sm:px-4 py-3 hover:bg-slate-700/30">
                      {/* 모바일 레이아웃 */}
                      <div className="sm:hidden space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white text-sm font-medium flex-1">{item.name}</p>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-xs">{formatPrice(price)} × {item.quantity}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-blue-400 font-bold text-sm min-w-[80px] text-right">{formatPrice(price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* PC 레이아웃 */}
                      <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5 text-white text-sm truncate pr-2">{item.name}</div>
                        <div className="col-span-2 text-right text-slate-300 text-sm">{formatPrice(price)}</div>
                        <div className="col-span-3 flex items-center justify-center gap-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              if (val >= 0) onUpdateQuantity(item.id, val);
                            }}
                            onFocus={(e) => e.target.select()}
                            className="w-12 h-7 text-center text-white font-medium bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 transition-colors ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="col-span-2 text-right text-blue-400 font-semibold">{formatPrice(price * item.quantity)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {cart.length === 0 && (
                <div className="p-10 text-center">
                  <ShoppingCart className="w-14 h-14 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">주문 상품이 없습니다</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-slate-400 text-sm mb-1.5">메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="추가 메모 입력 (선택)"
                rows={2}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 p-5 bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400">
              <p>총 수량: <span className="text-white font-semibold text-lg">{totalQuantity}개</span></p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 space-y-0.5 mb-1">
                <span>공급가액 {formatPrice(exVat)}</span>
                <span className="mx-2">+</span>
                <span>부가세 {formatPrice(vat)}</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatPrice(currentTotal)}</p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="space-y-3">
            {/* 상단 버튼 - 주요 액션 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || cart.length === 0}
                className={`py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  saved ? 'bg-green-600 text-white' : 
                  isSaving ? 'bg-slate-600 text-slate-400 cursor-not-allowed' :
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {saved ? <><Check className="w-5 h-5" />저장 완료!</> : 
                 isSaving ? <><RefreshCw className="w-5 h-5 animate-spin" />저장중...</> :
                 <><Check className="w-5 h-5" />주문 완료</>}
              </button>
              <button
                onClick={() => { if (cart.length > 0 && onSaveCart) onSaveCart(customerName); }}
                disabled={cart.length === 0}
                className={`py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />장바구니 담기
              </button>
            </div>
            
            {/* 하단 버튼 - 보조 액션 */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleCopy}
                disabled={cart.length === 0}
                className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  copied ? 'bg-green-600 text-white' : 
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {copied ? <><Check className="w-5 h-5" />완료</> : <><Copy className="w-5 h-5" />복사</>}
              </button>
              <button
                onClick={handlePrint}
                disabled={cart.length === 0}
                className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <Printer className="w-5 h-5" />인쇄
              </button>
              <button
                onClick={onClose}
                className="py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 관리자 페이지 ====================
function AdminPage({ products, onBack, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateStock, formatPrice, isLoading, onRefresh, customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onRefreshCustomers, onResetAllStock }) {
  const [activeTab, setActiveTab] = useState('products'); // products, customers
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [stockFilter, setStockFilter] = useState('all');
  const [showStockModal, setShowStockModal] = useState(null);
  const [showResetStockModal, setShowResetStockModal] = useState(false);
  const [resetStockValue, setResetStockValue] = useState(50);
  const [isResetting, setIsResetting] = useState(false);
  
  // 거래처 관련 state
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', memo: '' });
  const [deleteCustomerConfirm, setDeleteCustomerConfirm] = useState(null);

  const categories = ['전체', ...new Set(products.map(p => p.category))];
  
  // 재고 일괄 초기화
  const handleResetAllStock = async () => {
    setIsResetting(true);
    try {
      await onResetAllStock(resetStockValue);
      setShowResetStockModal(false);
    } catch (error) {
      console.error('재고 초기화 실패:', error);
    } finally {
      setIsResetting(false);
    }
  };

  // 거래처 추가
  const handleAddCustomer = async () => {
    if (!newCustomer.name) return;
    const success = await onAddCustomer(newCustomer);
    if (success) {
      setNewCustomer({ name: '', phone: '', address: '', memo: '' });
      setShowAddCustomerModal(false);
    }
  };

  // 거래처 수정
  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;
    await onUpdateCustomer(editingCustomer.id, {
      name: editingCustomer.name,
      phone: editingCustomer.phone,
      address: editingCustomer.address,
      memo: editingCustomer.memo
    });
    setEditingCustomer(null);
  };

  // 필터링된 거래처
  const filteredCustomers = (customers || []).filter(c => 
    c.name.toLowerCase().replace(/\s/g, '').includes(customerSearch.toLowerCase().replace(/\s/g, '')) ||
    (c.address && c.address.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (c.phone && c.phone.includes(customerSearch))
  );

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.wholesale || !newProduct.category) return;
    
    const product = {
      name: newProduct.name,
      wholesale: parseInt(newProduct.wholesale),
      retail: newProduct.retail ? parseInt(newProduct.retail) : null,
      category: newProduct.category,
      stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
      min_stock: newProduct.min_stock ? parseInt(newProduct.min_stock) : 5
    };
    
    const success = await onAddProduct(product);
    if (success) {
      setNewProduct({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' });
      setShowAddModal(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    const product = {
      name: editingProduct.name,
      wholesale: parseInt(editingProduct.wholesale),
      retail: editingProduct.retail ? parseInt(editingProduct.retail) : null,
      category: editingProduct.category,
      stock: editingProduct.stock !== undefined ? parseInt(editingProduct.stock) : 0,
      min_stock: editingProduct.min_stock !== undefined ? parseInt(editingProduct.min_stock) : 5
    };
    
    await onUpdateProduct(editingProduct.id, product);
    setEditingProduct(null);
  };

  const handleQuickStock = async (productId, newStock) => {
    await onUpdateStock(productId, { stock: parseInt(newStock) || 0 });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const stockStats = useMemo(() => {
    const outOfStock = products.filter(p => (p.stock ?? 50) === 0).length;
    const lowStock = products.filter(p => (p.stock ?? 50) > 0 && (p.stock ?? 50) <= (p.min_stock || 5)).length;
    const normalStock = products.filter(p => (p.stock ?? 50) > (p.min_stock || 5)).length;
    return { outOfStock, lowStock, normalStock, total: products.length };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
        let matchesStock = true;
        const stock = p.stock ?? 50;
        const minStock = p.min_stock || 5;
        if (stockFilter === 'out') {
          matchesStock = stock === 0;
        } else if (stockFilter === 'low') {
          matchesStock = stock > 0 && stock <= minStock;
        } else if (stockFilter === 'normal') {
          matchesStock = stock > minStock;
        }
        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name, 'ko');
            break;
          case 'wholesale':
            comparison = a.wholesale - b.wholesale;
            break;
          case 'stock':
            comparison = (a.stock ?? 50) - (b.stock ?? 50);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category, 'ko');
            break;
          default:
            comparison = 0;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortField, sortDirection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-bold text-white">관리자</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={activeTab === 'products' ? onRefresh : onRefreshCustomers} disabled={isLoading} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {activeTab === 'products' ? (
              <>
                <button 
                  onClick={() => setShowResetStockModal(true)} 
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  재고 초기화
                </button>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-medium transition-colors">
                  <Plus className="w-5 h-5" />
                  제품 추가
                </button>
              </>
            ) : (
              <button onClick={() => setShowAddCustomerModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors">
                <Plus className="w-5 h-5" />
                거래처 추가
              </button>
            )}
          </div>
        </div>
        {/* 탭 메뉴 */}
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              제품 관리 ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'customers' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              거래처 관리 ({(customers || []).length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'products' ? (
          <>
        {/* 재고 현황 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div onClick={() => setStockFilter('all')} className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'all' ? 'ring-2 ring-blue-500' : 'hover:bg-slate-750'}`}>
            <p className="text-slate-400 text-sm mb-1">전체 제품</p>
            <p className="text-2xl font-bold text-white">{stockStats.total}</p>
          </div>
          <div onClick={() => setStockFilter('normal')} className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'normal' ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-750'}`}>
            <p className="text-slate-400 text-sm mb-1">정상 재고</p>
            <p className="text-2xl font-bold text-emerald-400">{stockStats.normalStock}</p>
          </div>
          <div onClick={() => setStockFilter('low')} className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'low' ? 'ring-2 ring-yellow-500' : 'hover:bg-slate-750'}`}>
            <p className="text-slate-400 text-sm mb-1">재고 부족</p>
            <p className="text-2xl font-bold text-yellow-400">{stockStats.lowStock}</p>
          </div>
          <div onClick={() => setStockFilter('out')} className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'out' ? 'ring-2 ring-red-500' : 'hover:bg-slate-750'}`}>
            <p className="text-slate-400 text-sm mb-1">품절</p>
            <p className="text-2xl font-bold text-red-400">{stockStats.outOfStock}</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="제품 검색..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 제품 테이블 */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700">
                    제품명 {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('category')} className="px-4 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700">
                    카테고리 {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('wholesale')} className="px-4 py-3 text-right text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700">
                    도매가 {sortField === 'wholesale' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">소비자가</th>
                  <th onClick={() => handleSort('stock')} className="px-4 py-3 text-center text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700">
                    재고 {sortField === 'stock' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProducts.map(product => {
                  const stock = product.stock ?? 50;
                  const minStock = product.min_stock || 5;
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock <= minStock;
                  
                  return (
                    <tr key={product.id} className={`hover:bg-slate-700/30 ${isOutOfStock ? 'bg-red-900/10' : isLowStock ? 'bg-yellow-900/10' : ''}`}>
                      <td className="px-4 py-3 text-white">{product.name}</td>
                      <td className="px-4 py-3 text-slate-400">{product.category}</td>
                      <td className="px-4 py-3 text-right text-emerald-400">{formatPrice(product.wholesale)}</td>
                      <td className="px-4 py-3 text-right text-blue-400">{product.retail ? formatPrice(product.retail) : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setShowStockModal(product)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isOutOfStock ? 'bg-red-600/20 text-red-400' :
                            isLowStock ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-emerald-600/20 text-emerald-400'
                          }`}
                        >
                          {isOutOfStock ? '품절' : `${stock}개`}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-slate-600 rounded-lg text-blue-400">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(product.id)} className="p-2 hover:bg-slate-600 rounded-lg text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              검색 결과가 없습니다
            </div>
          )}
        </div>
          </>
        ) : (
          /* 거래처 관리 탭 */
          <>
            {/* 거래처 검색 */}
            <div className="bg-slate-800 rounded-xl p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="거래처명, 주소, 전화번호 검색..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">검색 결과: {filteredCustomers.length}개</p>
            </div>

            {/* 거래처 목록 */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/50 border-b border-slate-600">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">업체명</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">연락처</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">주소</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">메모</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-300">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className={`border-b border-slate-700 hover:bg-slate-700/50 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                        <td className="px-4 py-3">
                          <span className="text-white font-medium">{customer.name}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{customer.phone || '-'}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">{customer.address || '-'}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{customer.memo || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingCustomer(customer)}
                              className="p-2 hover:bg-blue-600/20 rounded-lg text-blue-400 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {deleteCustomerConfirm === customer.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => { onDeleteCustomer(customer.id); setDeleteCustomerConfirm(null); }}
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                                >
                                  삭제
                                </button>
                                <button
                                  onClick={() => setDeleteCustomerConfirm(null)}
                                  className="px-2 py-1 bg-slate-600 text-white text-xs rounded"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteCustomerConfirm(customer.id)}
                                className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCustomers.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  등록된 거래처가 없습니다
                </div>
              )}
            </div>

            {/* 거래처 추가 모달 */}
            {showAddCustomerModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-600/20 rounded-xl">
                      <Building className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">거래처 추가</h3>
                      <p className="text-slate-400 text-sm">새 거래처 정보를 입력하세요</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">업체명 *</label>
                      <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="업체명" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">연락처</label>
                      <input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="010-1234-5678" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">주소</label>
                      <input type="text" value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="배송 주소" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">메모</label>
                      <input type="text" value={newCustomer.memo} onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})} placeholder="참고사항" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAddCustomerModal(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">취소</button>
                    <button onClick={handleAddCustomer} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-medium transition-colors">추가</button>
                  </div>
                </div>
              </div>
            )}

            {/* 거래처 수정 모달 */}
            {editingCustomer && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600/20 rounded-xl">
                      <Edit3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">거래처 수정</h3>
                      <p className="text-slate-400 text-sm">거래처 정보를 수정합니다</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">업체명 *</label>
                      <input type="text" value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">연락처</label>
                      <input type="text" value={editingCustomer.phone || ''} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">주소</label>
                      <input type="text" value={editingCustomer.address || ''} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">메모</label>
                      <input type="text" value={editingCustomer.memo || ''} onChange={(e) => setEditingCustomer({...editingCustomer, memo: e.target.value})} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setEditingCustomer(null)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">취소</button>
                    <button onClick={handleUpdateCustomer} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">저장</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 제품 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl animate-scale-in">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-600/20 rounded-xl">
                <Plus className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">제품 추가</h3>
                <p className="text-slate-400 text-sm">새 제품을 등록합니다</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* 제품명 */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  제품명 <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                  placeholder="예: 레조 100 150 54" 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" 
                />
              </div>
              
              {/* 카테고리 */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  카테고리 <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text"
                  list="category-list"
                  value={newProduct.category} 
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
                  placeholder="선택 또는 새 카테고리 입력" 
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all" 
                />
                <datalist id="category-list">
                  {categories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>
              
              {/* 가격 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    도매가 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.wholesale} 
                      onChange={(e) => setNewProduct({...newProduct, wholesale: e.target.value})} 
                      placeholder="0" 
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all pr-10" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    소비자가 <span className="text-slate-500 text-xs">(선택)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.retail} 
                      onChange={(e) => setNewProduct({...newProduct, retail: e.target.value})} 
                      placeholder="0" 
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all pr-10" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                  </div>
                </div>
              </div>
              
              {/* 재고 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    초기 재고
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.stock} 
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                      placeholder="50" 
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all pr-10" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">개</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    최소 재고 <span className="text-slate-500 text-xs">(알림 기준)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.min_stock} 
                      onChange={(e) => setNewProduct({...newProduct, min_stock: e.target.value})} 
                      placeholder="5" 
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all pr-10" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">개</span>
                  </div>
                </div>
              </div>
              
              {/* 도움말 */}
              <div className="bg-slate-700/50 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400 text-xs">
                  <span className="text-red-400">*</span> 표시는 필수 입력 항목입니다. 
                  재고를 입력하지 않으면 기본값 50개로 설정됩니다.
                </p>
              </div>
            </div>
            
            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setShowAddModal(false); setNewProduct({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' }); }} 
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleAddProduct} 
                disabled={!newProduct.name || !newProduct.wholesale || !newProduct.category}
                className={`flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors ${
                  !newProduct.name || !newProduct.wholesale || !newProduct.category
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                <Plus className="w-5 h-5" />
                제품 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제품 수정 모달 */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Edit3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">제품 수정</h3>
                <p className="text-slate-400 text-sm">제품 정보를 수정합니다</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">제품명 *</label>
                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="제품명 입력" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">카테고리 *</label>
                <input type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} placeholder="카테고리 입력" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">도매가 *</label>
                  <div className="relative">
                    <input type="number" value={editingProduct.wholesale} onChange={(e) => setEditingProduct({...editingProduct, wholesale: e.target.value})} placeholder="0" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">소비자가</label>
                  <div className="relative">
                    <input type="number" value={editingProduct.retail || ''} onChange={(e) => setEditingProduct({...editingProduct, retail: e.target.value})} placeholder="0" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">현재 재고</label>
                  <div className="relative">
                    <input type="number" value={editingProduct.stock ?? 50} onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} placeholder="50" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">개</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">최소 재고</label>
                  <div className="relative">
                    <input type="number" value={editingProduct.min_stock || 5} onChange={(e) => setEditingProduct({...editingProduct, min_stock: e.target.value})} placeholder="5" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">개</span>
                  </div>
                </div>
              </div>
              {/* 재고 상태 미리보기 */}
              <div className="bg-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">재고 상태 미리보기</p>
                <div className="flex items-center gap-2">
                  {(editingProduct.stock || 0) === 0 ? (
                    <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium">품절</span>
                  ) : (editingProduct.stock || 0) <= (editingProduct.min_stock || 5) ? (
                    <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm font-medium">재고 부족 ({editingProduct.stock}개)</span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm font-medium">정상 ({editingProduct.stock}개)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors">취소</button>
              <button onClick={handleUpdateProduct} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 재고 수정 모달 */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-white mb-2">재고 수정</h3>
            <p className="text-slate-400 mb-4">{showStockModal.name}</p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = Math.max(0, parseInt(input.value || 0) - 10); }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">-10</button>
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = Math.max(0, parseInt(input.value || 0) - 1); }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">-1</button>
              <input id="stock-input" type="number" defaultValue={showStockModal.stock || 0} className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:border-amber-500" />
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = parseInt(input.value || 0) + 1; }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">+1</button>
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = parseInt(input.value || 0) + 10; }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">+10</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowStockModal(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">취소</button>
              <button onClick={() => { const newStock = document.getElementById('stock-input').value; handleQuickStock(showStockModal.id, newStock); setShowStockModal(null); }} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-white mb-2">제품 삭제</h3>
            <p className="text-slate-400 mb-4">이 제품을 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">취소</button>
              <button onClick={() => { onDeleteProduct(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium">삭제</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 재고 일괄 초기화 모달 */}
      {showResetStockModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl animate-scale-in">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <RotateCcw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">재고 일괄 초기화</h3>
                <p className="text-slate-400 text-sm">모든 제품의 재고를 설정한 값으로 초기화합니다</p>
              </div>
            </div>
            
            {/* 현재 상태 표시 */}
            <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-slate-400 text-xs mb-1">전체 제품</p>
                  <p className="text-white font-bold text-lg">{products.length}개</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">품절 제품</p>
                  <p className="text-red-400 font-bold text-lg">{products.filter(p => (p.stock ?? 50) === 0).length}개</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">재고 부족</p>
                  <p className="text-yellow-400 font-bold text-lg">{products.filter(p => (p.stock ?? 50) > 0 && (p.stock ?? 50) <= (p.min_stock || 5)).length}개</p>
                </div>
              </div>
            </div>
            
            {/* 초기화 값 설정 */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                초기화할 재고 수량
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={resetStockValue} 
                  onChange={(e) => setResetStockValue(parseInt(e.target.value) || 0)}
                  min="0"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg font-bold text-center focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">개</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 30, 50, 100].map(val => (
                  <button 
                    key={val}
                    onClick={() => setResetStockValue(val)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      resetStockValue === val 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {val}개
                  </button>
                ))}
              </div>
            </div>
            
            {/* 경고 */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium text-sm">주의!</p>
                  <p className="text-red-400/80 text-xs">이 작업은 되돌릴 수 없습니다. 모든 제품의 재고가 {resetStockValue}개로 변경됩니다.</p>
                </div>
              </div>
            </div>
            
            {/* 버튼 */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetStockModal(false)} 
                disabled={isResetting}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleResetAllStock}
                disabled={isResetting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    초기화 중...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    {products.length}개 제품 초기화
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 주문 내역 페이지
function OrderHistoryPage({ orders, onBack, onDeleteOrder, onDeleteMultiple, onViewOrder, onRefresh, isLoading, formatPrice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, week, month, custom
  const [customDate, setCustomDate] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showFilterDeleteConfirm, setShowFilterDeleteConfirm] = useState(false); // 필터 기준 전체 삭제

  // 날짜 필터링 함수
  const filterByDate = (order) => {
    if (dateFilter === 'all') return true;
    
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const orderDay = new Date(orderDate);
      orderDay.setHours(0, 0, 0, 0);
      return orderDay.getTime() === today.getTime();
    }
    
    if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const orderDay = new Date(orderDate);
      orderDay.setHours(0, 0, 0, 0);
      return orderDay.getTime() === yesterday.getTime();
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    }
    
    if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return orderDate >= monthAgo;
    }
    
    if (dateFilter === 'custom' && customDate) {
      const selectedDate = new Date(customDate);
      const orderDay = new Date(orderDate);
      return (
        orderDay.getFullYear() === selectedDate.getFullYear() &&
        orderDay.getMonth() === selectedDate.getMonth() &&
        orderDay.getDate() === selectedDate.getDate()
      );
    }
    
    return true;
  };

  const filteredOrders = orders
    .filter(filterByDate)
    .filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm))
    );

  // 필터된 주문의 통계
  const filteredTotalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const filteredTotalExVat = calcExVat(filteredTotalSales);

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalExVat = calcExVat(totalSales);

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.orderNumber));
    }
  };

  // 개별 선택
  const handleSelect = (orderNumber) => {
    setSelectedOrders(prev => 
      prev.includes(orderNumber) 
        ? prev.filter(o => o !== orderNumber)
        : [...prev, orderNumber]
    );
  };

  // 선택 삭제
  const handleBulkDelete = () => {
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedOrders);
    } else {
      selectedOrders.forEach(orderNumber => onDeleteOrder(orderNumber));
    }
    setSelectedOrders([]);
    setShowBulkDeleteConfirm(false);
  };

  // 필터 기준 전체 삭제
  const handleFilterDelete = () => {
    const orderNumbersToDelete = filteredOrders.map(o => o.orderNumber);
    if (onDeleteMultiple) {
      onDeleteMultiple(orderNumbersToDelete);
    } else {
      orderNumbersToDelete.forEach(orderNumber => onDeleteOrder(orderNumber));
    }
    setSelectedOrders([]);
    setShowFilterDeleteConfirm(false);
  };

  // 필터 라벨 가져오기
  const getFilterLabel = () => {
    switch(dateFilter) {
      case 'today': return '오늘';
      case 'yesterday': return '어제';
      case 'week': return '최근 7일';
      case 'month': return '최근 1개월';
      case 'custom': return customDate;
      default: return '전체';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40 animate-fade-in-down">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors btn-ripple hover-lift">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center animate-pulse-glow">
                  <List className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white gradient-text">주문 내역</h1>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Cloud className="w-3 h-3" />
                    <span>클라우드 공유</span>
                    <Users className="w-3 h-3 ml-1" />
                    <span>총 {orders.length}건</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedOrders.length > 0 && (
                <button
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  선택 삭제 ({selectedOrders.length})
                </button>
              )}
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 btn-ripple hover-lift"
              >
                <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700 card-glow animate-fade-in-up stagger-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <FileText className="w-4 h-4" />
              {dateFilter === 'all' ? '총 주문' : '조회 주문'}
            </div>
            <p className="text-2xl font-bold text-white">{filteredOrders.length}건</p>
            {dateFilter !== 'all' && <p className="text-xs text-slate-500 mt-1">전체 {orders.length}건</p>}
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700 card-glow animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Calculator className="w-4 h-4" />
              {dateFilter === 'all' ? '총 매출' : '조회 매출'}
            </div>
            <p className="text-2xl font-bold text-emerald-400">{formatPrice(filteredTotalSales)}</p>
            {dateFilter !== 'all' && <p className="text-xs text-slate-500 mt-1">전체 {formatPrice(totalSales)}</p>}
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700 card-glow animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Receipt className="w-4 h-4" />
              공급가액
            </div>
            <p className="text-2xl font-bold text-blue-400">{formatPrice(filteredTotalExVat)}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700 card-glow animate-fade-in-up stagger-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Receipt className="w-4 h-4" />
              부가세
            </div>
            <p className="text-2xl font-bold text-purple-400">{formatPrice(filteredTotalSales - filteredTotalExVat)}</p>
          </div>
        </div>

        {/* 검색 & 날짜 필터 */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-slate-700 animate-fade-in-up stagger-5">
          {/* 날짜 필터 버튼 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: '전체' },
              { key: 'today', label: '오늘' },
              { key: 'yesterday', label: '어제' },
              { key: 'week', label: '이번 주' },
              { key: 'month', label: '이번 달' },
              { key: 'custom', label: '날짜 선택' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setDateFilter(key); setSelectedOrders([]); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateFilter === key
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
            <button
              onClick={() => setShowFilterDeleteConfirm(true)}
              disabled={filteredOrders.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filteredOrders.length === 0 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/40'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {getFilterLabel()} 삭제 ({filteredOrders.length})
            </button>
          </div>
          
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="주문번호, 고객명, 연락처 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          {/* 필터 결과 요약 & 전체 선택 */}
          <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-slate-400">전체 선택</span>
              </label>
              <span className="text-slate-400">
                검색 결과: <span className="text-white font-semibold">{filteredOrders.length}건</span>
                {selectedOrders.length > 0 && <span className="text-emerald-400 ml-2">({selectedOrders.length}개 선택됨)</span>}
              </span>
            </div>
            <span className="text-emerald-400 font-semibold">
              {formatPrice(filteredTotalSales)}
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8 animate-fade-in">
            <RefreshCw className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-spin" />
            <p className="text-slate-400">불러오는 중...</p>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <List className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">{orders.length === 0 ? '저장된 주문 내역이 없습니다' : '검색 결과가 없습니다'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order, index) => (
              <div key={order.orderNumber} className={`bg-slate-800/50 backdrop-blur rounded-xl border ${selectedOrders.includes(order.orderNumber) ? 'border-emerald-500' : 'border-slate-700'} overflow-hidden card-glow hover-lift animate-fade-in-up`} style={{animationDelay: `${Math.min(index * 0.05, 0.3)}s`}}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* 체크박스 */}
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.orderNumber)}
                      onChange={() => handleSelect(order.orderNumber)}
                      className="mt-1 w-5 h-5 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          order.priceType === 'wholesale' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {order.priceType === 'wholesale' ? '도매' : '소비자'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateTime(order.createdAt)}
                        </span>
                        {order.customerName && <span>{order.customerName}</span>}
                      </div>
                      <div className="mt-2 text-sm text-slate-400">
                        {order.items.length}종 / {order.items.reduce((sum, item) => sum + item.quantity, 0)}개
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-slate-500">공급가 {formatPrice(calcExVat(order.totalAmount))}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all btn-ripple"
                    >
                      <Eye className="w-4 h-4" />
                      상세보기
                    </button>
                    {deleteConfirm === order.orderNumber ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onDeleteOrder(order.orderNumber);
                            setDeleteConfirm(null);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors btn-ripple"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(order.orderNumber)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택 삭제 확인 모달 */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">선택 삭제</h3>
                <p className="text-slate-400 text-sm">{selectedOrders.length}개 주문 삭제</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">선택한 {selectedOrders.length}개의 주문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 필터 기준 전체 삭제 확인 모달 */}
      {showFilterDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-red-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/30 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">⚠️ 주문 일괄 삭제</h3>
                <p className="text-red-400 text-sm font-medium">{getFilterLabel()} 주문 {filteredOrders.length}건</p>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-slate-200 font-medium mb-2">다음 주문이 모두 삭제됩니다:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• 필터: <span className="text-white">{getFilterLabel()}</span></li>
                <li>• 삭제 대상: <span className="text-red-400 font-bold">{filteredOrders.length}건</span></li>
                <li>• 총 금액: <span className="text-white">{formatPrice(filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0))}</span></li>
              </ul>
              <p className="text-red-400 text-xs mt-3">⚠️ 이 작업은 되돌릴 수 없습니다!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilterDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleFilterDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                삭제 실행
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PriceCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [cart, setCart] = useState([]);
  const [priceType, setPriceType] = useState('wholesale');
  const [activeTab, setActiveTab] = useState('catalog');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('main'); // main, history, admin
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState(null);
  const [savedCarts, setSavedCarts] = useState([]);
  const [isSaveCartModalOpen, setIsSaveCartModalOpen] = useState(false);
  const [saveCartCustomerName, setSaveCartCustomerName] = useState('');
  const [isSavedCartsModalOpen, setIsSavedCartsModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [showStockOverview, setShowStockOverview] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showCustomerListModal, setShowCustomerListModal] = useState(false);
  const [showTextAnalyzeModal, setShowTextAnalyzeModal] = useState(false);

  // 동적 카테고리 목록 (Supabase products 기반)
  const dynamicCategories = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : priceData;
    return [...new Set(sourceProducts.map(item => item.category))];
  }, [products]);
  
  // expandedCategories 초기화
  useEffect(() => {
    if (dynamicCategories.length > 0 && Object.keys(expandedCategories).length === 0) {
      const initial = {};
      dynamicCategories.forEach(cat => initial[cat] = true);
      setExpandedCategories(initial);
    }
  }, [dynamicCategories]);

  // Lenis 부드러운 스크롤 초기화
  useEffect(() => {
    // 모바일 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    const lenis = new Lenis({
      duration: 1.2,           // 스크롤 지속 시간 (높을수록 부드러움)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 물리 기반 이징
      orientation: 'vertical', // 수직 스크롤
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile,  // 모바일에서는 휠 스크롤 비활성화
      smoothTouch: false,      // 터치 스크롤은 네이티브로
      wheelMultiplier: 1,      // 휠 속도
      touchMultiplier: 2,      // 터치 속도
      infinite: false,         // 무한 스크롤 끄기
      prevent: (node) => {
        // data-lenis-prevent 속성이 있는 요소 내부에서는 Lenis 비활성화
        // 또는 모바일에서는 모든 스크롤 영역에서 비활성화
        if (isMobile) return true;
        return node.closest('[data-lenis-prevent]') !== null;
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 클린업
    return () => {
      lenis.destroy();
    };
  }, []);

  // 토스트 알림 표시
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // 저장된 장바구니 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('pos_saved_carts');
    if (saved) {
      try {
        setSavedCarts(JSON.parse(saved));
      } catch (e) {
        console.error('저장된 장바구니 불러오기 실패:', e);
      }
    }
  }, []);

  // 저장된 장바구니 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pos_saved_carts', JSON.stringify(savedCarts));
  }, [savedCarts]);

  // 장바구니 저장
  const saveCartWithName = (name) => {
    const now = new Date();
    const total = cart.reduce((sum, item) => {
      const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
      return sum + (price * item.quantity);
    }, 0);
    
    const newCart = {
      name,
      items: cart.map(item => ({ ...item })),
      total,
      priceType,
      date: now.toLocaleDateString('ko-KR'),
      time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setSavedCarts(prev => [newCart, ...prev]);
    setCart([]); // 장바구니 초기화
    showToast(`💾 "${name}" 저장됨! (장바구니 초기화)`);
  };

  // 저장된 장바구니 불러오기
  const loadSavedCart = (savedCart) => {
    const validItems = savedCart.items.filter(item => 
      priceData.some(p => p.id === item.id)
    ).map(item => {
      const currentProduct = priceData.find(p => p.id === item.id);
      return currentProduct ? {
        ...currentProduct,
        quantity: item.quantity
      } : null;
    }).filter(Boolean);
    
    if (validItems.length === 0) {
      showToast('⚠️ 불러올 수 있는 제품이 없습니다', 'error');
      return;
    }
    
    setCart(validItems);
    setPriceType(savedCart.priceType);
    
    if (validItems.length < savedCart.items.length) {
      showToast(`📦 ${validItems.length}/${savedCart.items.length}개 제품 불러옴`);
    } else {
      showToast(`📦 "${savedCart.name}" 불러옴!`);
    }
  };

  // 저장된 장바구니 삭제
  const deleteSavedCart = (index) => {
    setSavedCarts(prev => prev.filter((_, i) => i !== index));
    showToast('🗑️ 장바구니가 삭제되었습니다');
  };

  // ===== 제품 관리 함수들 =====
  // Supabase에서 제품 불러오기
  const loadProducts = async () => {
    setIsProductLoading(true);
    try {
      const data = await supabase.getProducts();
      if (data) {
        // 재고 기본값 설정 (null/undefined만 50, 0은 품절로 유지)
        const productsWithStock = data.map(p => ({
          ...p,
          stock: p.stock !== null && p.stock !== undefined ? p.stock : 50,
          min_stock: p.min_stock !== null && p.min_stock !== undefined ? p.min_stock : 5
        }));
        setProducts(productsWithStock);
        setIsOnline(true);
      }
    } catch (error) {
      console.log('제품 목록 불러오기 실패:', error);
    } finally {
      setIsProductLoading(false);
    }
  };

  // 거래처 목록 불러오기
  const loadCustomers = async () => {
    try {
      const data = await supabase.getCustomers();
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.log('거래처 목록 불러오기 실패:', error);
    }
  };

  // 거래처 추가
  const addCustomer = async (customer) => {
    try {
      const result = await supabase.addCustomer(customer);
      if (result) {
        await loadCustomers();
        showToast('✅ 거래처가 추가되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 거래처 추가 실패', 'error');
    }
    return false;
  };

  // 거래처 수정
  const updateCustomer = async (id, customer) => {
    try {
      const result = await supabase.updateCustomer(id, customer);
      if (result) {
        await loadCustomers();
        showToast('✅ 거래처가 수정되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 거래처 수정 실패', 'error');
    }
    return false;
  };

  // 거래처 삭제
  const deleteCustomer = async (id) => {
    try {
      const result = await supabase.deleteCustomer(id);
      if (result) {
        await loadCustomers();
        showToast('🗑️ 거래처가 삭제되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 거래처 삭제 실패', 'error');
    }
    return false;
  };

  // 제품 추가
  const addProduct = async (product) => {
    try {
      const result = await supabase.addProduct(product);
      if (result) {
        await loadProducts();
        showToast('✅ 제품이 추가되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 제품 추가 실패', 'error');
    }
    return false;
  };

  // 제품 수정
  const updateProduct = async (id, product) => {
    try {
      const result = await supabase.updateProduct(id, product);
      if (result) {
        await loadProducts();
        showToast('✅ 제품이 수정되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 제품 수정 실패', 'error');
    }
    return false;
  };

  // 제품 삭제
  const deleteProduct = async (id) => {
    try {
      const result = await supabase.deleteProduct(id);
      if (result) {
        await loadProducts();
        showToast('🗑️ 제품이 삭제되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 제품 삭제 실패', 'error');
    }
    return false;
  };

  // 재고 수정
  const updateStock = async (id, stockData) => {
    try {
      const result = await supabase.updateProduct(id, stockData);
      if (result) {
        await loadProducts();
        showToast('📦 재고가 수정되었습니다');
        return true;
      }
    } catch (error) {
      showToast('❌ 재고 수정 실패', 'error');
    }
    return false;
  };

  // 재고 일괄 초기화
  const resetAllStock = async (stockValue) => {
    try {
      const sourceProducts = products.length > 0 ? products : priceData;
      let successCount = 0;
      
      for (const product of sourceProducts) {
        try {
          await supabase.updateProduct(product.id, { stock: stockValue });
          successCount++;
        } catch (err) {
          console.log('재고 초기화 실패:', product.name, err);
        }
      }
      
      await loadProducts();
      showToast(`✅ ${successCount}개 제품 재고가 ${stockValue}개로 초기화되었습니다`);
      return true;
    } catch (error) {
      console.error('재고 일괄 초기화 실패:', error);
      showToast('❌ 재고 초기화 실패', 'error');
      return false;
    }
  };

  // 관리자 로그인 처리
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setCurrentPage('admin');
      loadProducts();
    } else {
      showToast('❌ 비밀번호가 틀렸습니다', 'error');
    }
  };

  // Supabase에서 주문 불러오기
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await supabase.getOrders();
      if (data) {
        // Supabase 형식을 기존 형식으로 변환
        const formattedOrders = data.map(order => ({
          orderNumber: order.id,
          createdAt: order.created_at,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          priceType: order.price_type,
          items: order.items,
          totalAmount: order.total,
          memo: order.memo
        }));
        setOrders(formattedOrders);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.log('주문 내역 불러오기 실패:', error);
      setOrders([]);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Supabase에 주문 저장
  const saveOrder = async (orderData) => {
    setIsSaving(true);
    try {
      // Supabase 형식으로 변환
      const supabaseOrder = {
        id: orderData.orderNumber,
        customer_name: orderData.customerName || null,
        customer_phone: orderData.customerPhone || null,
        price_type: orderData.priceType,
        items: orderData.items,
        subtotal: Math.round(orderData.totalAmount / 1.1),
        vat: orderData.totalAmount - Math.round(orderData.totalAmount / 1.1),
        total: orderData.totalAmount,
        memo: orderData.memo || null
      };
      
      const result = await supabase.saveOrder(supabaseOrder);
      if (result) {
        // 신규 업체 자동 등록 체크
        if (orderData.customerName && !orderData.existingCustomerId) {
          // 기존 거래처인지 확인
          const existingCustomer = customers.find(c => 
            c.name.toLowerCase().replace(/\s/g, '') === orderData.customerName.toLowerCase().replace(/\s/g, '')
          );
          
          if (!existingCustomer) {
            // 신규 업체 등록
            try {
              const newCustomer = await supabase.addCustomer({
                name: orderData.customerName,
                phone: orderData.customerPhone || null,
                address: orderData.customerAddress || null,
                memo: `자동 등록 (${new Date().toLocaleDateString()})`
              });
              if (newCustomer) {
                setCustomers(prev => [...prev, newCustomer]);
                console.log('✅ 신규 거래처 자동 등록:', orderData.customerName);
              }
            } catch (err) {
              console.log('신규 거래처 등록 실패:', err);
            }
          }
        }
        
        // 새 주문을 목록 앞에 추가
        const newOrder = {
          orderNumber: orderData.orderNumber,
          createdAt: new Date().toISOString(),
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          priceType: orderData.priceType,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          memo: orderData.memo
        };
        setOrders(prev => [newOrder, ...prev]);
        
        // 재고 감소 처리
        for (const item of orderData.items) {
          const product = products.find(p => p.id === item.id);
          if (product) {
            const currentStock = product.stock !== undefined ? product.stock : 50;
            const newStock = Math.max(0, currentStock - item.quantity);
            try {
              await supabase.updateProduct(item.id, { stock: newStock });
            } catch (err) {
              console.log('재고 업데이트 실패:', item.name, err);
            }
          }
        }
        
        // 로컬 상태도 업데이트
        setProducts(prev => prev.map(p => {
          const orderedItem = orderData.items.find(i => i.id === p.id);
          if (orderedItem) {
            const currentStock = p.stock !== undefined ? p.stock : 50;
            return { ...p, stock: Math.max(0, currentStock - orderedItem.quantity) };
          }
          return p;
        }));
        
        // priceData도 업데이트 (로컬)
        orderData.items.forEach(item => {
          const product = priceData.find(p => p.id === item.id);
          if (product) {
            product.stock = Math.max(0, (product.stock ?? 50) - item.quantity);
          }
        });
        
        // 주문 완료 후 장바구니 초기화
        setCart([]);
        
        setIsOnline(true);
        return true;
      } else {
        setIsOnline(false);
        alert('서버 연결 실패. 나중에 다시 시도해주세요.');
        return false;
      }
    } catch (error) {
      console.error('주문 저장 실패:', error);
      setIsOnline(false);
      alert('저장에 실패했습니다. 인터넷 연결을 확인해주세요.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Supabase에서 주문 삭제
  const deleteOrder = async (orderNumber) => {
    setIsLoading(true);
    try {
      const success = await supabase.deleteOrder(orderNumber);
      if (success) {
        setOrders(prev => prev.filter(order => order.orderNumber !== orderNumber));
        setIsOnline(true);
        showToast('🗑️ 주문이 삭제되었습니다');
      } else {
        setIsOnline(false);
        showToast('❌ 삭제에 실패했습니다', 'error');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      setIsOnline(false);
      showToast('❌ 삭제에 실패했습니다', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 여러 주문 한번에 삭제 (알림 한 번만)
  const deleteMultipleOrders = async (orderNumbers) => {
    if (!orderNumbers || orderNumbers.length === 0) return;
    
    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      for (const orderNumber of orderNumbers) {
        const success = await supabase.deleteOrder(orderNumber);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      // 상태 업데이트 (한 번에)
      setOrders(prev => prev.filter(order => !orderNumbers.includes(order.orderNumber)));
      
      // 알림 한 번만
      if (failCount === 0) {
        showToast(`🗑️ ${successCount}건 삭제 완료!`);
        setIsOnline(true);
      } else {
        showToast(`⚠️ ${successCount}건 삭제, ${failCount}건 실패`, 'error');
      }
    } catch (error) {
      console.error('일괄 삭제 실패:', error);
      showToast('❌ 삭제 중 오류 발생', 'error');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, []);

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    // Supabase products 사용, 없으면 priceData fallback
    const sourceProducts = products.length > 0 ? products : priceData;
    return sourceProducts.filter(product => {
      // 띄어쓰기 제거 후 비교
      const productName = product.name.toLowerCase().replace(/\s/g, '');
      const search = searchTerm.toLowerCase().replace(/\s/g, '');
      const matchesSearch = productName.includes(search);
      const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach(product => {
      if (!groups[product.category]) groups[product.category] = [];
      groups[product.category].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const addToCart = (product) => {
    const baseStock = product.stock !== undefined ? product.stock : 50;
    const existingItem = cart.find(item => item.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    
    // 재고 체크
    if (currentQty >= baseStock) {
      showToast('⚠️ 재고가 부족합니다', 'error');
      return;
    }
    
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(productId);
    
    // 재고 체크
    const product = products.length > 0 
      ? products.find(p => p.id === productId)
      : priceData.find(p => p.id === productId);
    const baseStock = product?.stock !== undefined ? product.stock : 50;
    
    if (newQuantity > baseStock) {
      showToast('⚠️ 재고가 부족합니다', 'error');
      return;
    }
    
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
      return sum + (price * item.quantity);
    }, 0);
  }, [cart, priceType]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // 관리자 페이지
  if (currentPage === 'admin') {
    return (
      <AdminPage
        products={products.length > 0 ? products : priceData}
        onBack={() => { setCurrentPage('main'); setIsAdminLoggedIn(false); }}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onUpdateStock={updateStock}
        onResetAllStock={resetAllStock}
        formatPrice={formatPrice}
        isLoading={isProductLoading}
        onRefresh={loadProducts}
        customers={customers}
        onAddCustomer={addCustomer}
        onUpdateCustomer={updateCustomer}
        onDeleteCustomer={deleteCustomer}
        onRefreshCustomers={loadCustomers}
      />
    );
  }

  if (currentPage === 'history') {
    return (
      <>
        <OrderHistoryPage
          orders={orders}
          onBack={() => setCurrentPage('main')}
          onDeleteOrder={deleteOrder}
          onDeleteMultiple={deleteMultipleOrders}
          onViewOrder={viewOrder}
          onRefresh={loadOrders}
          isLoading={isLoading}
          formatPrice={formatPrice}
        />
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); setSelectedOrder(null); }}
          order={selectedOrder}
          formatPrice={formatPrice}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        priceType={priceType}
        totalAmount={totalAmount}
        formatPrice={formatPrice}
        onSaveOrder={saveOrder}
        isSaving={isSaving}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onAddItem={addToCart}
        products={priceData}
        onSaveCart={(name) => { setSaveCartCustomerName(name || ''); setIsSaveCartModalOpen(true); }}
        customers={customers}
      />
      <SaveCartModal 
        isOpen={isSaveCartModalOpen} 
        onClose={() => setIsSaveCartModalOpen(false)} 
        onSave={saveCartWithName} 
        cart={cart} 
        priceType={priceType} 
        formatPrice={formatPrice}
        customerName={saveCartCustomerName}
      />
      <SavedCartsModal 
        isOpen={isSavedCartsModalOpen} 
        onClose={() => setIsSavedCartsModalOpen(false)} 
        savedCarts={savedCarts} 
        onLoad={loadSavedCart} 
        onDelete={deleteSavedCart} 
        formatPrice={formatPrice} 
      />
      <ShippingLabelModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        orders={orders}
        customers={customers}
        formatPrice={formatPrice}
      />
      <CustomerListModal
        isOpen={showCustomerListModal}
        onClose={() => setShowCustomerListModal(false)}
        customers={customers}
        orders={orders}
        formatPrice={formatPrice}
      />
      <TextAnalyzeModal
        isOpen={showTextAnalyzeModal}
        onClose={() => setShowTextAnalyzeModal(false)}
        products={products.length > 0 ? products : priceData}
        onAddToCart={(product, qty) => {
          // 이미 장바구니에 있으면 수량 추가
          const existing = cart.find(item => item.id === product.id);
          if (existing) {
            setCart(cart.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + qty }
                : item
            ));
          } else {
            setCart([...cart, { ...product, quantity: qty }]);
          }
          showToast(`✅ ${product.name} ${qty}개 추가`);
        }}
        formatPrice={formatPrice}
        priceType={priceType}
      />

      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40 animate-fade-in-down">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* 로고 & 타이틀 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-amber-400">POS 재고관리 시스템</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-amber-400">POS</h1>
              </div>
              {/* 온라인 상태 표시 */}
              <div className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isOnline 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? '클라우드 연결됨' : '오프라인'}
              </div>
            </div>
            
            {/* 버튼들 */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="관리자"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </button>
              
              {/* 주문 이력 - 메인 버튼 */}
              <button
                onClick={() => { setCurrentPage('history'); loadOrders(); }}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="주문 이력"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                {orders.length > 0 && (
                  <span className="min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 sm:px-1.5 bg-emerald-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                    {orders.length > 99 ? '99+' : orders.length}
                  </span>
                )}
              </button>
              
              {/* 저장된 장바구니 */}
              <button
                onClick={() => setIsSavedCartsModalOpen(true)}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 rounded-lg transition-all hover-lift btn-ripple relative"
                title="저장된 장바구니"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                {savedCarts.length > 0 && (
                  <span className="min-w-4 sm:min-w-5 h-4 sm:h-5 px-1 sm:px-1.5 bg-violet-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                    {savedCarts.length > 9 ? '9+' : savedCarts.length}
                  </span>
                )}
              </button>
              
              {/* 장바구니 - 모바일 */}
              <button
                onClick={() => setActiveTab(activeTab === 'cart' ? 'catalog' : 'cart')}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg hover-lift btn-ripple"
                title="장바구니"
              >
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                {cart.length > 0 && (
                  <span className="min-w-5 h-5 px-1.5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {/* 구분선 */}
              <div className="hidden sm:block w-px h-6 bg-slate-600 mx-1"></div>
              
              {/* AI 주문 인식 버튼 - 노란색 */}
              <button
                onClick={() => setShowTextAnalyzeModal(true)}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-yellow-600/30 hover:bg-yellow-600/50 border border-yellow-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="AI 주문 인식"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </button>
              
              <button
                onClick={() => { loadCustomers(); setShowCustomerListModal(true); }}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="거래처 목록"
              >
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
              
              <button
                onClick={() => setShowStockOverview(true)}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="재고 현황"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
              
              <button
                onClick={() => { loadOrders(); setShowShippingModal(true); }}
                className="flex-shrink-0 flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="택배 송장"
              >
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-3 pb-48 md:pb-3">
        <div className="flex flex-col md:flex-row gap-6">
          <div className={`flex-1 ${activeTab === 'cart' ? 'hidden md:block' : ''}`}>
            <div className="bg-gradient-to-r from-blue-900/80 to-blue-800/60 backdrop-blur-md rounded-xl p-3 mb-4 border border-blue-600/50 sticky top-14 sm:top-16 z-30 shadow-lg shadow-blue-900/20 animate-fade-in-down">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="제품명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="전체">전체</option>
                  {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                
                <div className="flex bg-slate-900/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setPriceType('wholesale')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      priceType === 'wholesale' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    도매가
                  </button>
                  <button
                    onClick={() => setPriceType('retail')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      priceType === 'retail' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    소비자가
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-2 text-slate-400 text-xs">
              {filteredProducts.length}개 제품
            </div>

            {Object.keys(groupedProducts).length === 0 ? (
              <div className="text-center py-8 animate-fade-in">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">검색 결과가 없습니다</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(groupedProducts).map(([category, products], index) => {
                const isExpanded = expandedCategories[category] !== false;
                return (
                <div key={category} className={`bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden card-glow animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                  <div 
                    onClick={() => setExpandedCategories(prev => ({...prev, [category]: !isExpanded}))}
                    className="px-4 py-3 bg-gradient-to-r from-slate-700/80 to-slate-700/50 border-b border-slate-600/50 cursor-pointer hover:from-slate-600/80 hover:to-slate-600/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </span>
                        <span className="text-white font-bold">{category}</span>
                      </div>
                      <span className="text-xs text-slate-300 bg-slate-600 px-2 py-1 rounded-full">{products.length}개</span>
                    </div>
                  </div>
                  
                  {isExpanded && (
                  <div className="p-2 grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto category-scroll animate-fade-in overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {products.map(product => {
                      const cartItem = cart.find(item => item.id === product.id);
                      const cartQuantity = cartItem ? cartItem.quantity : 0;
                      const displayPrice = priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
                      const exVatPrice = Math.round(displayPrice / 1.1);
                      const baseStock = product.stock !== undefined ? product.stock : 50;
                      const availableStock = baseStock - cartQuantity; // 장바구니 수량 차감
                      const isOutOfStock = availableStock <= 0;
                      const isLowStock = availableStock > 0 && availableStock <= (product.min_stock || 5);
                      
                      return (
                        <div 
                          key={product.id} 
                          onClick={() => !isOutOfStock && !cartItem && addToCart(product)}
                          className={`px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 hover-lift ${
                            cartItem 
                              ? 'bg-blue-600/30 border border-blue-500/50' 
                              : isOutOfStock
                                ? 'bg-red-900/20 border border-red-500/30 opacity-60 cursor-not-allowed'
                                : 'bg-slate-700/30 hover:bg-slate-700/60 border border-transparent hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-white text-xs font-medium truncate flex-1 pr-1">{product.name}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                              isOutOfStock ? 'bg-red-600/30 text-red-400' :
                              isLowStock ? 'bg-yellow-600/30 text-yellow-400' :
                              'bg-emerald-600/30 text-emerald-400'
                            }`}>
                              {isOutOfStock ? '품절' : `${availableStock}개`}
                            </span>
                          </div>
                          
                          {cartItem ? (
                            /* 장바구니에 담긴 상태 - 컴팩트 레이아웃 */
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-sm font-bold whitespace-nowrap ${priceType === 'wholesale' ? 'text-blue-400' : 'text-red-400'}`}>
                                {formatPrice(displayPrice)}
                              </p>
                              <div className="flex items-center gap-0.5 bg-slate-800 rounded flex-shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity - 1); }} className="w-6 h-6 flex items-center justify-center hover:bg-slate-600 rounded-l">
                                  <Minus className="w-3 h-3 text-white" />
                                </button>
                                <input
                                  type="number"
                                  value={cartItem.quantity}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    if (val >= 0) updateQuantity(product.id, val);
                                  }}
                                  onFocus={(e) => e.target.select()}
                                  className="w-8 h-6 text-center text-white text-xs font-bold bg-transparent border-none focus:outline-none focus:bg-slate-600 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }} className="w-6 h-6 flex items-center justify-center hover:bg-slate-600 rounded-r">
                                  <Plus className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* 일반 상태 */
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <p className={`text-sm font-bold whitespace-nowrap ${priceType === 'wholesale' ? 'text-blue-400' : 'text-red-400'}`}>
                                  {formatPrice(displayPrice)}
                                </p>
                                <p className="text-[10px] text-slate-500 whitespace-nowrap">
                                  (VAT제외 {formatPrice(exVatPrice)})
                                </p>
                              </div>
                              <Plus className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
              );
              })}
            </div>
            )}
          </div>

          <div className={`md:w-[420px] lg:w-[480px] ${activeTab === 'catalog' ? 'hidden md:block' : ''} fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto z-40 md:z-auto`}>
            <div className="bg-gradient-to-r from-emerald-900/90 to-teal-900/80 backdrop-blur-md md:rounded-xl border-t-2 md:border border-emerald-500/50 md:sticky md:top-14 shadow-2xl shadow-emerald-900/30 md:shadow-lg animate-slide-in-right">
              <div className="px-3 py-2 border-b border-emerald-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-white">주문 목록</h2>
                  <span className="text-xs text-emerald-300 bg-emerald-800/50 px-2 py-0.5 rounded-full">{cart.length}종 / {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
                </div>
                <button onClick={() => setActiveTab('catalog')} className="md:hidden p-1 hover:bg-emerald-800/50 rounded btn-ripple">
                  <X className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              <div className="max-h-52 md:max-h-80 overflow-y-auto order-scroll overscroll-contain mobile-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch' }}>
                {cart.length === 0 ? (
                  <div className="p-6 text-center">
                    <ShoppingCart className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                    <p className="text-emerald-400/70 text-sm">주문 목록이 비어있습니다</p>
                  </div>
                ) : (
                  <div className="p-2 grid grid-cols-2 gap-1.5">
                    {cart.map(item => {
                      const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
                      const itemTotal = price * item.quantity;
                      const baseStock = item.stock !== undefined ? item.stock : 50;
                      const remainingStock = baseStock - item.quantity;
                      return (
                        <div key={item.id} className="bg-emerald-950/40 rounded-lg p-2 hover:bg-emerald-900/50 transition-colors group relative">
                          {/* 삭제 버튼 */}
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          
                          {/* 상품명 + 남은재고 */}
                          <div className="flex items-center justify-between pr-5 mb-2">
                            <p className="text-white text-xs font-medium truncate flex-1">{item.name}</p>
                            <span className={`text-[9px] px-1 py-0.5 rounded ${remainingStock <= 0 ? 'bg-red-600/30 text-red-400' : remainingStock <= 5 ? 'bg-yellow-600/30 text-yellow-400' : 'bg-slate-600/30 text-slate-400'}`}>
                              {remainingStock <= 0 ? '마지막' : `잔여${remainingStock}`}
                            </span>
                          </div>
                          
                          {/* 수량 + 금액 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-emerald-800/50 rounded-lg px-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                className="w-6 h-6 flex items-center justify-center hover:bg-emerald-700 rounded text-emerald-300 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  if (val >= 0) updateQuantity(item.id, val);
                                }}
                                onFocus={(e) => e.target.select()}
                                className="w-10 h-6 text-center text-white text-sm font-bold bg-transparent border-none focus:outline-none focus:bg-emerald-700/50 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                className="w-6 h-6 flex items-center justify-center hover:bg-emerald-700 rounded text-emerald-300 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-emerald-400 text-xs font-semibold">{formatPrice(itemTotal)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-3 border-t border-emerald-700/50 bg-emerald-950/50 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-emerald-300/70 text-xs">
                      <p>공급가 {formatPrice(calcExVat(totalAmount))}</p>
                      <p>VAT {formatPrice(totalAmount - calcExVat(totalAmount))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400/70 text-xs">총 금액</p>
                      <p className="text-2xl font-bold text-white">{formatPrice(totalAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => setCart([])} className="py-2.5 px-4 bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-200 rounded-xl text-sm font-medium btn-ripple hover-lift transition-all">
                      초기화
                    </button>
                    <button onClick={() => setIsOrderModalOpen(true)} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 btn-ripple hover-lift transition-all shadow-lg shadow-emerald-900/50">
                      <Calculator className="w-5 h-5" />
                      주문 확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-900/95 to-teal-900/90 backdrop-blur border-t-2 border-emerald-500/50 p-3 animate-fade-in-up" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-300/70 text-xs">공급가 {formatPrice(calcExVat(totalAmount))} + VAT</p>
            <p className="text-white text-xl font-bold">{formatPrice(totalAmount)}</p>
          </div>
          <button 
            onClick={() => cart.length > 0 ? setIsOrderModalOpen(true) : setActiveTab('cart')} 
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 btn-ripple hover-lift transition-all shadow-lg shadow-emerald-900/50"
          >
            <Calculator className="w-5 h-5" />
            주문 확인 ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </div>
      
      {/* 토스트 알림 */}
      {toast && (
        <div className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        } text-white font-medium animate-fade-in`}>
          {toast.message}
        </div>
      )}

      {/* 재고 현황 모달 */}
      {showStockOverview && (
        <StockOverviewModal 
          isOpen={showStockOverview}
          onClose={() => setShowStockOverview(false)}
          products={products.length > 0 ? products : priceData}
          categories={dynamicCategories}
          formatPrice={formatPrice}
        />
      )}

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-600/20 rounded-xl">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">관리자 로그인</h3>
                <p className="text-slate-400 text-sm">비밀번호를 입력하세요</p>
              </div>
            </div>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="비밀번호"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-medium transition-colors"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
