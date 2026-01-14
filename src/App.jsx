import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Lenis from 'lenis';
import { Search, ShoppingCart, ShoppingBag, Package, Calculator, Trash2, Plus, Minus, X, ChevronDown, ChevronUp, FileText, Copy, Check, Printer, History, List, Save, Eye, Calendar, Clock, ChevronLeft, Cloud, RefreshCw, Users, Receipt, Wifi, WifiOff, Settings, Lock, Upload, Download, Edit, Edit3, LogOut, Zap, AlertTriangle, MapPin, Phone, Building, Truck, RotateCcw, Sparkles, ArrowLeft, Bell } from 'lucide-react';

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

  async updateOrder(id, order) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(order)
      });
      if (!response.ok) throw new Error('Failed to update order');
      return await response.json();
    } catch (error) {
      console.error('Supabase updateOrder error:', error);
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
  },

  // ===== 저장된 장바구니 관련 =====
  async getSavedCarts() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts?order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch saved carts');
      return await response.json();
    } catch (error) {
      console.error('Supabase getSavedCarts error:', error);
      return null;
    }
  },

  async addSavedCart(cart) {
    try {
      console.log('🔵 Supabase에 장바구니 저장 시도:', cart);
      const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(cart)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Supabase addSavedCart error response:', errorText);

        // 컬럼이 없는 경우 재시도 (예약 필드 제외)
        if (errorText.includes('column') || errorText.includes('does not exist')) {
          console.log('⚠️ Supabase 테이블에 예약 필드 컬럼 없음. 기본 필드만 저장...');
          console.log('⚠️ Supabase 테이블에 다음 컬럼들을 추가하세요: delivery_date, status, priority, memo, reminded');
          const basicCart = {
            name: cart.name,
            items: cart.items,
            total: cart.total,
            price_type: cart.price_type,
            date: cart.date,
            time: cart.time,
            created_at: cart.created_at
          };

          const retryResponse = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(basicCart)
          });

          if (!retryResponse.ok) {
            throw new Error('Failed to add saved cart (retry)');
          }
          const result = await retryResponse.json();
          console.log('✅ 기본 필드만 저장 완료:', result);
          // 예약 필드를 원본 데이터에서 복원하여 반환
          return [{
            ...result[0],
            delivery_date: cart.delivery_date,
            status: cart.status,
            priority: cart.priority,
            memo: cart.memo,
            reminded: cart.reminded,
            _localOnly: true // 로컬 전용 플래그
          }];
        }

        throw new Error('Failed to add saved cart');
      }

      const result = await response.json();
      console.log('✅ Supabase 저장 완료:', result);
      return result;
    } catch (error) {
      console.error('❌ Supabase addSavedCart error:', error);
      return null;
    }
  },

  async deleteSavedCart(id) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete saved cart');
      return true;
    } catch (error) {
      console.error('Supabase deleteSavedCart error:', error);
      return false;
    }
  },

  async updateSavedCart(id, cart) {
    try {
      console.log('🔵 Supabase 장바구니 업데이트 시도:', { id, cart });
      const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(cart)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Supabase updateSavedCart error response:', errorText);

        // 컬럼이 없는 경우 재시도 (예약 필드 제외)
        if (errorText.includes('column') || errorText.includes('does not exist')) {
          console.log('⚠️ Supabase 테이블에 예약 필드 컬럼 없음. 기본 필드만 업데이트...');
          console.log('⚠️ Supabase 테이블에 다음 컬럼들을 추가하세요: delivery_date, status, priority, memo, reminded');
          const basicCart = {
            name: cart.name,
            items: cart.items,
            total: cart.total,
            price_type: cart.price_type
          };

          const retryResponse = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(basicCart)
          });

          if (!retryResponse.ok) {
            throw new Error('Failed to update saved cart (retry)');
          }
          const result = await retryResponse.json();
          console.log('✅ 기본 필드만 업데이트 완료:', result);
          // 예약 필드를 원본 데이터에서 복원하여 반환
          return [{
            ...result[0],
            delivery_date: cart.delivery_date,
            status: cart.status,
            priority: cart.priority,
            memo: cart.memo,
            reminded: cart.reminded,
            _localOnly: true
          }];
        }

        throw new Error('Failed to update saved cart');
      }

      const result = await response.json();
      console.log('✅ Supabase 업데이트 완료:', result);
      return result;
    } catch (error) {
      console.error('❌ Supabase updateSavedCart error:', error);
      return null;
    }
  },

  async deleteAllSavedCarts() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_carts?id=gt.0`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete all saved carts');
      return true;
    } catch (error) {
      console.error('Supabase deleteAllSavedCarts error:', error);
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
      background: #1e293b; /* slate-800 - 헤더와 동일 */
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
      background: #1e293b; /* slate-800 - 헤더와 동일 */
      min-height: 100vh;
    }
    
    #root {
      background: #1e293b; /* slate-800 - 헤더와 동일 */
      min-height: 100vh;
    }
    
    /* 모든 요소 텍스트 선택 방지 */
    *, *::before, *::after {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* 텍스트 드래그 방지 */
    h1, h2, h3, h4, h5, h6, p, span, div, label {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-drag: none;
    }
    
    /* 카드, 버튼 등 인터랙티브 요소 */
    .card, [class*="rounded"], [class*="bg-slate"], [class*="border"] {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
    
    /* 입력 필드와 복사 필요한 데이터만 선택 가능 */
    input, textarea, [contenteditable="true"], .selectable {
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
      overscroll-behavior: contain !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: pan-y !important;
    }
    
    /* 모달 오버레이 스크롤 방지 */
    .fixed.inset-0 {
      overscroll-behavior: none;
      touch-action: none;
    }
    
    /* 모달 내부 컨텐츠는 스크롤 허용 */
    .fixed.inset-0 .modal-scroll-area {
      overscroll-behavior: contain !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: pan-y !important;
    }
    
    /* 모바일 터치 스크롤 강화 */
    .mobile-scroll {
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      touch-action: pan-y !important;
      scroll-behavior: auto !important;
    }
    
    /* 모바일에서 모달 스크롤 영역 */
    @media (max-width: 768px) {
      /* 모달 스크롤 영역 강화 */
      .modal-scroll-area {
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
        touch-action: pan-y !important;
        overflow-y: auto !important;
      }
      
      /* 모달 높이 모바일 최적화 */
      .max-h-\\[90vh\\] {
        max-height: 85vh !important;
      }
      
      .max-h-\\[calc\\(90vh-200px\\)\\] {
        max-height: calc(85vh - 180px) !important;
      }
      
      /* body 스크롤 잠금 시 */
      body.modal-open {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
      }
    }
    
    /* 스크롤바 숨기기 유틸리티 */
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }

    .scrollbar-hide::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
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
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-up {
      animation: slideUp 0.3s ease-out forwards;
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
    
    /* 시크릿 관리자 로그인 애니메이션 */
    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
    }
    
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
      25%, 75% { opacity: 0.9; }
    }
    
    @keyframes neon-pulse {
      0%, 100% { 
        text-shadow: 0 0 5px #ff0040, 0 0 10px #ff0040, 0 0 20px #ff0040;
        box-shadow: 0 0 5px #ff0040, 0 0 10px #ff0040, inset 0 0 10px rgba(255,0,64,0.1);
      }
      50% { 
        text-shadow: 0 0 10px #ff0040, 0 0 20px #ff0040, 0 0 40px #ff0040;
        box-shadow: 0 0 10px #ff0040, 0 0 20px #ff0040, inset 0 0 20px rgba(255,0,64,0.2);
      }
    }
    
    @keyframes border-glow {
      0%, 100% { border-color: rgba(255,0,64,0.5); }
      50% { border-color: rgba(255,0,64,1); }
    }
    
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink-caret {
      0%, 100% { border-color: transparent; }
      50% { border-color: #ff0040; }
    }
    
    @keyframes matrix-rain {
      0% { transform: translateY(-100%); opacity: 1; }
      100% { transform: translateY(100%); opacity: 0; }
    }
    
    @keyframes unlock-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes access-granted {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes loading-bar {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    
    @keyframes shake-error {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
      20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
    
    @keyframes flash-red {
      0%, 100% { 
        border-color: rgba(255,0,64,0.5);
        box-shadow: 0 0 40px rgba(255,0,64,0.3);
      }
      25%, 75% { 
        border-color: rgba(255,0,64,1);
        box-shadow: 0 0 60px rgba(255,0,64,0.8), inset 0 0 30px rgba(255,0,64,0.2);
      }
    }
    
    .animate-shake-error {
      animation: shake-error 0.5s ease-in-out;
    }
    
    .animate-flash-red {
      animation: flash-red 0.5s ease-in-out;
    }
    
    .animate-glitch {
      animation: glitch 0.3s ease-in-out infinite;
    }
    
    .animate-flicker {
      animation: flicker 0.1s ease-in-out infinite;
    }
    
    .animate-neon-pulse {
      animation: neon-pulse 2s ease-in-out infinite;
    }
    
    .animate-border-glow {
      animation: border-glow 2s ease-in-out infinite;
    }
    
    .secret-scanline::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,0,64,0.5), transparent);
      animation: scanline 3s linear infinite;
      pointer-events: none;
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
    
    .animate-scale-out {
      animation: scaleOut 0.2s ease-in forwards;
    }
    
    .animate-fade-out {
      animation: fadeOut 0.2s ease-in forwards;
    }
    
    @keyframes scaleOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    
    /* 스크롤바 숨기기 */
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
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
function OrderDetailModal({ isOpen, onClose, order, formatPrice, onUpdateOrder, products }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // order가 변경될 때마다 editedOrder 초기화
  useEffect(() => {
    if (order) {
      setEditedOrder({
        ...order,
        customerAddress: order.customerAddress || '',
        items: [...order.items]
      });
    }
  }, [order]);

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

  if (!isOpen || !order || !editedOrder) return null;

  // 편집된 주문의 총계 계산
  const currentItems = isEditing ? editedOrder.items : order.items;
  const currentTotal = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = currentItems.reduce((sum, item) => sum + item.quantity, 0);
  const exVat = calcExVat(currentTotal);
  const vat = currentTotal - exVat;

  // 제품 검색 필터링
  const filteredProducts = products ? products.filter(product => {
    if (!productSearchTerm) return false;
    const searchLower = productSearchTerm.toLowerCase().replace(/\s/g, '');
    const nameLower = product.name.toLowerCase().replace(/\s/g, '');
    return nameLower.includes(searchLower);
  }).slice(0, 8) : [];

  // 제품 수량 변경
  const handleQuantityChange = (index, delta) => {
    const newItems = [...editedOrder.items];
    const newQuantity = newItems[index].quantity + delta;
    if (newQuantity > 0) {
      newItems[index].quantity = newQuantity;
      setEditedOrder({ ...editedOrder, items: newItems });
    }
  };

  // 제품 삭제
  const handleRemoveItem = (index) => {
    const newItems = editedOrder.items.filter((_, i) => i !== index);
    if (newItems.length > 0) {
      setEditedOrder({ ...editedOrder, items: newItems });
    } else {
      alert('최소 1개의 제품이 필요합니다.');
    }
  };

  // 제품 추가
  const handleAddProduct = (product) => {
    const price = order.priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
    const existingIndex = editedOrder.items.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      // 이미 존재하면 수량 증가
      const newItems = [...editedOrder.items];
      newItems[existingIndex].quantity += 1;
      setEditedOrder({ ...editedOrder, items: newItems });
    } else {
      // 새 제품 추가
      const newItem = {
        id: product.id,
        name: product.name,
        price: price,
        quantity: 1
      };
      setEditedOrder({ ...editedOrder, items: [...editedOrder.items, newItem] });
    }
    setProductSearchTerm('');
    setShowProductSearch(false);
  };

  // 저장
  const handleSave = () => {
    const updatedOrder = {
      ...editedOrder,
      totalAmount: currentTotal,
      updatedAt: new Date().toISOString()
    };

    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    }
    setIsEditing(false);
    setShowProductSearch(false);
  };

  // 취소
  const handleCancel = () => {
    setEditedOrder({
      ...order,
      customerAddress: order.customerAddress || '',
      items: [...order.items]
    });
    setIsEditing(false);
    setShowProductSearch(false);
  };

  const generateOrderText = () => {
    let text = `[ 주문서 ]\n\n`;
    text += `주문번호: ${order.orderNumber}\n`;
    text += `주문일자: ${formatDate(order.createdAt)}\n`;
    if (order.customerName) text += `고객명: ${order.customerName}\n`;
    if (order.customerPhone) text += `연락처: ${order.customerPhone}\n`;
    text += `단가기준: ${order.priceType === 'wholesale' ? '도매가 (부가세 포함)' : '소비자가 (부가세 포함)'}\n\n`;
    text += `[ 상품 목록 ]\n\n`;

    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name}\n`;
      text += `   ${formatPrice(item.price)} × ${item.quantity}개 = ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    text += `[ 결제 정보 ]\n\n`;
    text += `총 수량: ${totalQuantity}개\n`;
    text += `공급가액: ${formatPrice(exVat)}\n`;
    text += `부가세: ${formatPrice(vat)}\n`;
    text += `총 금액: ${formatPrice(order.totalAmount)}\n\n`;

    if (order.memo) text += `메모: ${order.memo}\n\n`;

    text += `입금 계좌: 부산은행 010-5858-6046 진태욱\n`;

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
            .account { margin-top: 30px; padding: 15px; background: #f0f8ff; border: 1px solid #3b82f6; border-radius: 5px; text-align: center; }
            .account strong { color: #1e40af; font-size: 18px; }
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
          <div class="account">
            <strong>입금 계좌</strong><br>
            부산은행 010-5858-6046 진태욱
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/80 backdrop-blur-md" style={{ touchAction: 'none' }}>
      {/* 배경 오버레이 - 클릭 시 닫기 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
      />

      <div className="relative bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl animate-scale-in flex flex-col">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="p-4 sm:p-6 border-b border-slate-700">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
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
              <div>
                <span className="text-slate-400">업체명:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrder.customerName || ''}
                    onChange={(e) => setEditedOrder({ ...editedOrder, customerName: e.target.value })}
                    className="ml-2 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="업체명 입력"
                  />
                ) : (
                  <span className="text-white ml-2">{order.customerName || '-'}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400">전화번호:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrder.customerPhone || ''}
                    onChange={(e) => setEditedOrder({ ...editedOrder, customerPhone: e.target.value })}
                    className="ml-2 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="전화번호 입력"
                  />
                ) : (
                  <span className="text-white ml-2">{order.customerPhone || '-'}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block mb-1">배송주소:</span>
                {isEditing ? (
                  <textarea
                    value={editedOrder.customerAddress || ''}
                    onChange={(e) => setEditedOrder({ ...editedOrder, customerAddress: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="배송주소 입력"
                    rows="2"
                  />
                ) : (
                  <span className="text-white block">{order.customerAddress || '-'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                주문 상품 ({currentItems.length}종)
              </h3>
              {isEditing && (
                <button
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  제품 추가
                </button>
              )}
            </div>

            {/* 제품 검색 */}
            {isEditing && showProductSearch && (
              <div className="mb-4 relative">
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="제품명 검색..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {productSearchTerm && filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                    {filteredProducts.map(product => {
                      const price = order.priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
                      const alreadyAdded = editedOrder.items.some(item => item.id === product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => handleAddProduct(product)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-white text-sm">{product.name}</div>
                              <div className="text-slate-400 text-xs">{product.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-medium text-sm">{formatPrice(price)}</span>
                              {alreadyAdded && <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">추가됨</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 모바일: 카드 형식, 태블릿 이상: 표 형식 */}
            <div className="space-y-3">
              {currentItems.map((item, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                  {/* 모바일 카드 형식 */}
                  <div className="block sm:hidden">
                    <div className="p-3 space-y-2.5">
                      {/* 상품명 & 번호 */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">No.{index + 1}</span>
                          </div>
                          <div className="text-white font-medium text-sm leading-snug break-words">{item.name}</div>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="flex-shrink-0 p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* 가격 정보 */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-800/50 rounded-lg p-2">
                          <div className="text-slate-400 text-xs mb-0.5">단가</div>
                          <div className="text-slate-200 font-medium tabular-nums">{formatPrice(item.price)}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-2">
                          <div className="text-slate-400 text-xs mb-0.5">금액</div>
                          <div className="text-emerald-400 font-bold tabular-nums">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                      </div>

                      {/* 수량 조절 */}
                      <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2">
                        <span className="text-slate-400 text-xs">수량</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(index, -1)}
                              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white font-medium"
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-white font-bold tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(index, 1)}
                              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white font-medium"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-white font-medium tabular-nums">{item.quantity}개</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 태블릿/데스크탑 표 형식 */}
                  <div className="hidden sm:block">
                    <div className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                      <div className="col-span-1 text-slate-400 text-center font-medium">{index + 1}</div>
                      <div className="col-span-4 text-white font-medium">{item.name}</div>
                      <div className="col-span-2 text-right text-slate-300 tabular-nums">{formatPrice(item.price)}</div>
                      <div className="col-span-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleQuantityChange(index, -1)}
                              className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white font-medium"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-white font-medium tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(index, 1)}
                              className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white font-medium"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-white font-medium tabular-nums">{item.quantity}개</span>
                        )}
                      </div>
                      <div className="col-span-2 text-right text-emerald-400 font-bold tabular-nums">{formatPrice(item.price * item.quantity)}</div>
                      {isEditing && (
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {order.memo && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400 text-sm">메모: </span>
                <span className="text-white text-sm">{order.memo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-700 p-4 sm:p-6 bg-slate-900/50 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="text-slate-400 text-sm space-y-1">
              <p>총 수량: <span className="text-white font-medium tabular-nums">{totalQuantity}개</span></p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 space-y-1 mb-2">
                <p className="flex justify-between gap-3">
                  <span>공급가액:</span>
                  <span className="text-slate-300 tabular-nums">{formatPrice(exVat)}</span>
                </p>
                <p className="flex justify-between gap-3">
                  <span>부가세:</span>
                  <span className="text-slate-300 tabular-nums">{formatPrice(vat)}</span>
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{formatPrice(currentTotal)}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm sm:text-base transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium text-sm sm:text-base transition-colors"
              >
                저장
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base transition-colors"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                수정
              </button>
              <button
                onClick={handleCopy}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base transition-all ${
                  copied ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {copied ? <><Check className="w-4 h-4 sm:w-5 sm:h-5" />복사됨</> : <><Copy className="w-4 h-4 sm:w-5 sm:h-5" />복사</>}
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base transition-colors"
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                인쇄
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium text-sm sm:text-base transition-colors"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 저장된 장바구니 모달 ====================
// ==================== 저장된 장바구니 페이지 ====================
function SavedCartsPage({ savedCarts, onLoad, onDelete, onDeleteAll, onUpdate, products = [], formatPrice, onBack }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showFilterDeleteConfirm, setShowFilterDeleteConfirm] = useState(false); // 필터별 삭제
  const [detailCart, setDetailCart] = useState(null); // 상세 보기 모달용
  const [detailIndex, setDetailIndex] = useState(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false); // 상세보기 편집 모드
  const [editedDetailCart, setEditedDetailCart] = useState(null); // 편집 중인 장바구니
  const [showProductSearchDetail, setShowProductSearchDetail] = useState(false); // 제품 검색
  const [productSearchTermDetail, setProductSearchTermDetail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today'); // 기본값: 오늘
  const [deliveryFilter, setDeliveryFilter] = useState('all'); // 배송 예정일 필터
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false); // 상단 영역 접기/펼치기

  // 편집 모드 초기화 useEffect
  useEffect(() => {
    if (isEditingDetail && !editedDetailCart && detailCart) {
      setEditedDetailCart({ ...detailCart });
    }
  }, [isEditingDetail, editedDetailCart, detailCart]);

  // 상태 및 우선순위 스타일 helper
  const getStatusStyle = (status, priority) => {
    // 우선순위가 높으면 우선 적용
    if (priority === 'urgent' || priority === 'high') {
      return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', icon: '🔴', label: '긴급' };
    }

    switch(status) {
      case 'scheduled':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: '🟡', label: '예약' };
      case 'ready':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', icon: '🔵', label: '준비' };
      case 'hold':
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50', icon: '⚪', label: '보류' };
      case 'draft':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50', icon: '🟣', label: '작성중' };
      default:
        return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: '🟢', label: '대기' };
    }
  };

  // 배송 예정일 표시 helper
  const getDeliveryDateLabel = (deliveryDate) => {
    if (!deliveryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(deliveryDate);
    delivery.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: '오늘 발송', color: 'text-red-400 font-bold', urgent: true };
    if (diffDays === 1) return { label: '내일 발송', color: 'text-orange-400 font-semibold', urgent: true };
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}일 지연`, color: 'text-red-500 font-bold', urgent: true };
    if (diffDays <= 3) return { label: `${diffDays}일 후`, color: 'text-yellow-400', urgent: false };
    return { label: new Date(deliveryDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }), color: 'text-slate-400', urgent: false };
  };

  // 날짜 필터링 함수
  const filterByDate = (cart) => {
    if (dateFilter === 'all') return true;
    if (!cart.date && !cart.created_at) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let cartDate;
    
    // created_at (ISO 형식) 우선 사용
    if (cart.created_at) {
      cartDate = new Date(cart.created_at);
    } else {
      // cart.date 형식: "2026. 1. 10." 또는 "2026.01.09" 또는 "2026-01-09"
      const dateStr = cart.date.replace(/\s/g, '').replace(/\./g, '-').replace(/-$/, '');
      const parts = dateStr.split('-').filter(p => p);
      if (parts.length === 3) {
        cartDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        return false;
      }
    }
    
    cartDate.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      return cartDate.getTime() === today.getTime();
    }
    if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return cartDate.getTime() === yesterday.getTime();
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return cartDate >= weekAgo;
    }
    if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return cartDate >= monthAgo;
    }
    return true;
  };

  // 검색 필터링 함수
  const filterBySearch = (cart) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().replace(/\s/g, '');

    // 이름 검색
    if (cart.name?.toLowerCase().replace(/\s/g, '').includes(term)) return true;

    // 아이템 이름 검색
    if (cart.items?.some(item => item.name?.toLowerCase().replace(/\s/g, '').includes(term))) return true;

    // 날짜 검색
    if (cart.date?.includes(searchTerm)) return true;

    return false;
  };

  // 배송 예정일 필터링 함수
  const filterByDelivery = (cart) => {
    if (deliveryFilter === 'all') return true;
    if (!cart.delivery_date) return deliveryFilter === 'no_date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(cart.delivery_date);
    delivery.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24));

    if (deliveryFilter === 'today') return diffDays === 0;
    if (deliveryFilter === 'tomorrow') return diffDays === 1;
    if (deliveryFilter === 'this_week') return diffDays >= 0 && diffDays <= 7;
    if (deliveryFilter === 'overdue') return diffDays < 0;
    if (deliveryFilter === 'no_date') return false;

    return true;
  };

  // 필터 라벨 가져오기
  const getFilterLabel = () => {
    switch(dateFilter) {
      case 'today': return '오늘';
      case 'yesterday': return '어제';
      case 'week': return '이번 주';
      case 'month': return '이번 달';
      default: return '전체';
    }
  };

  // 필터 기준 전체 삭제
  const handleFilterDelete = async () => {
    const indicesToDelete = filteredCartsWithIndex.map(({ originalIndex }) => originalIndex);
    // 인덱스 큰 것부터 삭제해야 인덱스가 밀리지 않음
    for (const index of indicesToDelete.sort((a, b) => b - a)) {
      await onDelete(index);
    }
    setShowFilterDeleteConfirm(false);
  };

  // 필터링된 장바구니 목록
  const filteredCarts = savedCarts.filter(cart => filterByDate(cart) && filterBySearch(cart) && filterByDelivery(cart));

  // 필터링된 목록의 원본 인덱스 매핑 및 정렬 (배송일 기준)
  const filteredCartsWithIndex = savedCarts
    .map((cart, index) => ({ cart, originalIndex: index }))
    .filter(({ cart }) => filterByDate(cart) && filterBySearch(cart) && filterByDelivery(cart))
    .sort((a, b) => {
      // 배송일이 있는 것 우선
      if (!a.cart.delivery_date && b.cart.delivery_date) return 1;
      if (a.cart.delivery_date && !b.cart.delivery_date) return -1;
      if (!a.cart.delivery_date && !b.cart.delivery_date) return 0;

      // 배송일 오름차순 (가까운 날짜 먼저)
      const dateA = new Date(a.cart.delivery_date);
      const dateB = new Date(b.cart.delivery_date);
      return dateA - dateB;
    });

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteAllConfirm) {
          setShowDeleteAllConfirm(false);
        } else if (detailCart) {
          setDetailCart(null);
          setDetailIndex(null);
        } else if (selectMode) {
          setSelectMode(false);
          setSelectedItems([]);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, selectMode, detailCart, showDeleteAllConfirm]);
  
  // 항목 선택/해제
  const toggleSelect = (index) => {
    setSelectedItems(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  
  // 전체 선택/해제 (필터링된 항목만)
  const toggleSelectAll = () => {
    const filteredIndices = filteredCartsWithIndex.map(({ originalIndex }) => originalIndex);
    if (selectedItems.length === filteredIndices.length && filteredIndices.every(i => selectedItems.includes(i))) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredIndices);
    }
  };
  
  // 선택 삭제
  const deleteSelected = () => {
    const sortedIndices = [...selectedItems].sort((a, b) => b - a);
    sortedIndices.forEach(index => onDelete(index));
    setSelectedItems([]);
    setSelectMode(false);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (cart, index, e) => {
    // 선택 모드일 때는 체크박스 토글
    if (selectMode) {
      toggleSelect(index);
    } else {
      // 버튼 클릭이 아닌 경우에만 상세 모달 열기
      if (!e.target.closest('button')) {
        setDetailCart(cart);
        setDetailIndex(index);
      }
    }
  };

  // 총 금액 계산
  const totalAmount = filteredCarts.reduce((sum, cart) => sum + (cart.total || 0), 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 select-none">
      {/* 헤더 */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 select-none">
        <div className="w-full px-4 py-3">
          {/* 첫째 줄: 뒤로가기 + 제목 + 접기버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <Save className="w-5 h-5 text-violet-400" />
              <div>
                <h1 className="text-base font-bold text-white">저장된 장바구니</h1>
                <p className="text-violet-400 text-xs">전체 {savedCarts.length}개 · 필터 {filteredCarts.length}개</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* 액션 버튼 - 아이콘만 모바일에서 */}
              {savedCarts.length > 0 && !selectMode && (
                <>
                  <button
                    onClick={() => setSelectMode(true)}
                    className="p-2 sm:px-3 sm:py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center gap-1.5 font-medium transition-all"
                    title="선택"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">선택</span>
                  </button>
                  {/* 필터별 삭제 - 필터가 all이 아닐 때 */}
                  {dateFilter !== 'all' && (
                    <button
                      onClick={() => setShowFilterDeleteConfirm(true)}
                      disabled={filteredCarts.length === 0}
                      className={`p-2 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                        filteredCarts.length > 0 
                          ? 'bg-orange-600 hover:bg-orange-500 text-white' 
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                      title={`${getFilterLabel()} 삭제`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm">{getFilterLabel()}</span>
                    </button>
                  )}
                  {/* 전체 삭제 */}
                  <button
                    onClick={() => setShowDeleteAllConfirm(true)}
                    className="p-2 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1.5 font-medium transition-all"
                    title="전체삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">전체삭제</span>
                  </button>
                </>
              )}
              
              {/* 접기/펼치기 버튼 */}
              <button
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-1"
                title={isHeaderCollapsed ? '펼치기' : '접기'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* 선택 모드 바 */}
          {selectMode && (
            <div className="mt-3 flex items-center justify-between bg-violet-900/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                >
                  {selectedItems.length === filteredCartsWithIndex.length && filteredCartsWithIndex.length > 0 ? '전체 해제' : '전체 선택'}
                </button>
                <span className="text-violet-300 text-xs">{selectedItems.length}개 선택됨</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={deleteSelected}
                  disabled={selectedItems.length === 0}
                  className={`text-xs px-3 py-1 rounded flex items-center gap-1 ${
                    selectedItems.length > 0 
                      ? 'bg-red-600 hover:bg-red-500 text-white' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  삭제
                </button>
                <button
                  onClick={() => { setSelectMode(false); setSelectedItems([]); }}
                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded"
                >
                  취소
                </button>
              </div>
            </div>
          )}
          
          {/* 접힌 상태: 요약 정보 */}
          {isHeaderCollapsed && (
            <div className="mt-2 flex items-center justify-between text-xs bg-slate-700/30 rounded-lg px-3 py-2">
              <span className="text-slate-400">
                {dateFilter === 'today' ? '오늘' : dateFilter === 'yesterday' ? '어제' : dateFilter === 'week' ? '이번 주' : dateFilter === 'month' ? '이번 달' : '전체'} · {filteredCarts.length}건 · <span className="text-emerald-400 font-semibold">{formatPrice(totalAmount)}</span>
              </span>
              {searchTerm && <span className="text-violet-400">검색: {searchTerm}</span>}
            </div>
          )}
        </div>
        
        {/* 통계 + 필터 + 검색 영역 - 접기/펼치기 */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
          <div className="px-4 pb-4 space-y-3">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> 총 건수</p>
                <p className="text-white font-bold text-lg">{filteredCarts.length}건</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><Receipt className="w-3 h-3" /> 총 금액</p>
                <p className="text-emerald-400 font-bold text-lg">{formatPrice(totalAmount)}</p>
              </div>
            </div>
            
            {/* 저장 날짜 필터 */}
            <div>
              <p className="text-slate-400 text-xs mb-2">저장 날짜</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'today', label: '오늘' },
                  { key: 'yesterday', label: '어제' },
                  { key: 'week', label: '이번 주' },
                  { key: 'month', label: '이번 달' },
                  { key: 'all', label: '전체' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setDateFilter(key); setSelectedItems([]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      dateFilter === key
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 배송 예정일 필터 */}
            <div>
              <p className="text-slate-400 text-xs mb-2">배송 예정일</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: '전체', icon: '📦' },
                  { key: 'overdue', label: '지연', icon: '🔴' },
                  { key: 'today', label: '오늘', icon: '⚡' },
                  { key: 'tomorrow', label: '내일', icon: '🟡' },
                  { key: 'this_week', label: '이번주', icon: '📅' },
                  { key: 'no_date', label: '미지정', icon: '⚪' }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => { setDeliveryFilter(key); setSelectedItems([]); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      deliveryFilter === key
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="이름, 상품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-4">
        {savedCarts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">저장된 장바구니가 없습니다</p>
            <p className="text-slate-500 text-sm mt-1">장바구니를 저장하면 여기에 표시됩니다</p>
          </div>
        ) : filteredCartsWithIndex.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">검색 결과가 없습니다</p>
            <p className="text-slate-500 text-sm mt-1">다른 날짜나 검색어를 시도해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCartsWithIndex.map(({ cart, originalIndex }) => {
              const index = originalIndex;
              // 가격 계산 - priceType에 따라
              const cartItemsDisplay = cart.items.map(item => {
                const itemPrice = cart.priceType === 'wholesale' 
                  ? (item.wholesale || item.price || 0)
                  : (item.retail || item.wholesale || item.price || 0);
                return `${item.name}(${item.quantity})`;
              }).join(', ');
              
              return (
                <div 
                  key={index} 
                  onClick={(e) => handleCardClick(cart, index, e)}
                  className={`bg-slate-800 rounded-xl p-4 border transition-all duration-200 cursor-pointer transform select-none ${
                    selectMode && selectedItems.includes(index) 
                      ? 'ring-2 ring-violet-500 bg-violet-900/20 border-violet-500/50' 
                      : 'border-slate-700 hover:border-violet-500 hover:bg-slate-750 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 체크박스 (선택 모드일 때만) */}
                    {selectMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelect(index); }}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          selectedItems.includes(index)
                            ? 'bg-violet-500 border-violet-500'
                            : 'border-slate-500 hover:border-violet-400'
                        }`}
                      >
                        {selectedItems.includes(index) && <Check className="w-3 h-3 text-white" />}
                      </button>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold truncate">{cart.name}</h3>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              cart.priceType === 'wholesale' || cart.price_type === 'wholesale'
                                ? 'bg-blue-600/30 text-blue-400'
                                : 'bg-purple-600/30 text-purple-400'
                            }`}>
                              {(cart.priceType === 'wholesale' || cart.price_type === 'wholesale') ? '도매' : '소비자'}
                            </span>
                          </div>

                          {/* 상태 & 배송 예정일 */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {(() => {
                              const style = getStatusStyle(cart.status, cart.priority);
                              return (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${style.bg} ${style.text} ${style.border}`}>
                                  {style.icon} {style.label}
                                </span>
                              );
                            })()}
                            {cart.delivery_date && (() => {
                              const dateInfo = getDeliveryDateLabel(cart.delivery_date);
                              return dateInfo && (
                                <span className={`text-[10px] ${dateInfo.color}`}>
                                  📅 {dateInfo.label}
                                </span>
                              );
                            })()}
                          </div>

                          <p className="text-slate-400 text-xs mt-1">{cart.date} {cart.time}</p>
                        </div>
                        <p className="text-emerald-400 font-bold text-sm ml-2 flex-shrink-0">{formatPrice(cart.total)}</p>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-lg p-2 mb-3">
                        <p className="text-slate-400 text-sm truncate">
                          {cartItemsDisplay}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">{cart.items.length}종 / {cart.items.reduce((sum, item) => sum + item.quantity, 0)}개</p>
                        {cart.memo && (
                          <p className="text-cyan-400 text-xs mt-2 border-t border-slate-700 pt-2">
                            💬 {cart.memo}
                          </p>
                        )}
                      </div>
                      
                      {!selectMode && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onLoad(cart); onBack(); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            불러오기
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(index); }}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {deleteConfirm === index && !selectMode && (
                        <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-600/30">
                          <p className="text-red-400 text-sm mb-2">정말 삭제하시겠습니까?</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(index); setDeleteConfirm(null); }}
                              className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 rounded text-white text-sm"
                            >
                              삭제
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                              className="flex-1 py-1.5 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {detailCart && (() => {
        const currentCart = isEditingDetail ? (editedDetailCart || detailCart) : detailCart;

        // 제품 검색 필터링
        const filteredProductsDetail = products.length > 0 ? products.filter(product => {
          if (!productSearchTermDetail) return false;
          const searchLower = productSearchTermDetail.toLowerCase().replace(/\s/g, '');
          const nameLower = product.name.toLowerCase().replace(/\s/g, '');
          return nameLower.includes(searchLower);
        }).slice(0, 8) : [];

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/80 backdrop-blur-md" style={{ touchAction: 'none' }}>
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!isEditingDetail) {
                setDetailCart(null);
                setDetailIndex(null);
              }
            }}
          />
          <div className="relative bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col animate-scale-in">
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isEditingDetail ? (
                      <input
                        type="text"
                        value={currentCart.name}
                        onChange={(e) => setEditedDetailCart({ ...editedDetailCart, name: e.target.value })}
                        className="text-lg sm:text-2xl font-bold text-white bg-white/20 px-3 py-1 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 max-w-full"
                        placeholder="업체명/이름"
                      />
                    ) : (
                      <h2 className="text-lg sm:text-2xl font-bold text-white break-words">{currentCart.name}</h2>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                      currentCart.priceType === 'wholesale' || currentCart.price_type === 'wholesale'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {(currentCart.priceType === 'wholesale' || currentCart.price_type === 'wholesale') ? '도매' : '소비자'}
                    </span>
                  </div>
                  <p className="text-violet-200 text-sm">{currentCart.date} {currentCart.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isEditingDetail && (
                  <button
                    onClick={() => { setIsEditingDetail(true); setEditedDetailCart({ ...detailCart }); }}
                    className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setDetailCart(null);
                    setDetailIndex(null);
                    setIsEditingDetail(false);
                    setEditedDetailCart(null);
                  }}
                  className="p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </button>
              </div>
            </div>

            {/* 상품 목록 */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 modal-scroll-area"
              data-lenis-prevent="true"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-white font-semibold flex items-center gap-2 text-lg sm:text-xl">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                  상품 목록 ({currentCart.items.length}종 / {currentCart.items.reduce((sum, item) => sum + item.quantity, 0)}개)
                </h3>
                {isEditingDetail && (
                  <button
                    onClick={() => setShowProductSearchDetail(!showProductSearchDetail)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">제품 추가</span>
                  </button>
                )}
              </div>

              {/* 제품 검색 */}
              {isEditingDetail && showProductSearchDetail && (
                <div className="mb-4 relative">
                  <input
                    type="text"
                    value={productSearchTermDetail}
                    onChange={(e) => setProductSearchTermDetail(e.target.value)}
                    placeholder="제품명 검색..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {productSearchTermDetail && filteredProductsDetail.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                      {filteredProductsDetail.map(product => {
                        const price = (currentCart.priceType === 'wholesale' || currentCart.price_type === 'wholesale') ? product.wholesale : (product.retail || product.wholesale);
                        const alreadyAdded = currentCart.items.some(item => item.id === product.id);
                        return (
                          <button
                            key={product.id}
                            onClick={() => {
                              if (!alreadyAdded) {
                                const newItems = [...currentCart.items, { ...product, quantity: 1, price }];
                                setEditedDetailCart({ ...editedDetailCart, items: newItems });
                              }
                              setProductSearchTermDetail('');
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-white text-sm">{product.name}</div>
                                <div className="text-slate-400 text-xs">{product.category}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-medium text-sm">{formatPrice(price)}</span>
                                {alreadyAdded && <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">추가됨</span>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                {currentCart.items.map((item, idx) => {
                  // 가격 계산 - 여러 필드 확인
                  let itemPrice = 0;
                  if (currentCart.priceType === 'wholesale' || currentCart.price_type === 'wholesale') {
                    itemPrice = item.wholesale || item.price || item.unitPrice || 0;
                  } else {
                    itemPrice = item.retail || item.wholesale || item.price || item.unitPrice || 0;
                  }

                  // total에서 역산 (가격 정보가 없는 경우)
                  if (itemPrice === 0 && currentCart.total && currentCart.items.length === 1) {
                    itemPrice = currentCart.total / item.quantity;
                  }

                  const itemTotal = itemPrice * item.quantity;
                  const itemSupply = Math.round(itemPrice / 1.1); // 공급가(VAT제외)
                  const itemTotalSupply = Math.round(itemTotal / 1.1); // 소계 공급가

                  return (
                    <div key={idx} className="bg-slate-700/50 rounded-xl p-3 sm:p-5 border border-slate-600 hover:border-violet-500 hover:bg-slate-700/80 transition-all duration-200">
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-base sm:text-xl break-words">{item.name}</p>
                          {itemPrice > 0 && (
                            <div className="mt-2">
                              <p className="text-blue-400 text-sm sm:text-base">{formatPrice(itemPrice)}</p>
                              <p className="text-slate-500 text-xs sm:text-sm">(VAT제외 {formatPrice(itemSupply)})</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          {isEditingDetail ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const newItems = [...currentCart.items];
                                  if (newItems[idx].quantity > 1) {
                                    newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity - 1 };
                                    setEditedDetailCart({ ...editedDetailCart, items: newItems });
                                  }
                                }}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-600 hover:bg-slate-500 rounded-lg flex items-center justify-center text-white transition-colors"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="text-white font-semibold text-base sm:text-lg min-w-[3rem] text-center">×{item.quantity}</span>
                              <button
                                onClick={() => {
                                  const newItems = [...currentCart.items];
                                  newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity + 1 };
                                  setEditedDetailCart({ ...editedDetailCart, items: newItems });
                                }}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white transition-colors"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const newItems = currentCart.items.filter((_, i) => i !== idx);
                                  setEditedDetailCart({ ...editedDetailCart, items: newItems });
                                }}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600/20 hover:bg-red-600 rounded-lg flex items-center justify-center text-red-400 hover:text-white transition-colors ml-1"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-slate-300 text-base sm:text-lg">×{item.quantity}개</p>
                          )}
                          {itemPrice > 0 ? (
                            <div className="text-right">
                              <p className="text-emerald-400 font-bold text-lg sm:text-2xl">{formatPrice(itemTotal)}</p>
                              <p className="text-slate-500 text-xs sm:text-sm">(VAT제외 {formatPrice(itemTotalSupply)})</p>
                            </div>
                          ) : (
                            <p className="text-slate-500 text-xs sm:text-sm mt-1">가격 정보 없음</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 금액 요약 + 버튼 */}
            <div className="border-t border-slate-700 p-4 sm:p-6 flex-shrink-0 bg-slate-800">
              <div className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 hover:from-slate-900/90 hover:to-slate-900/60 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm sm:text-base">공급가액</span>
                  <span className="text-slate-300 text-base sm:text-lg">{formatPrice(Math.round(currentCart.total / 1.1))}</span>
                </div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700">
                  <span className="text-slate-500 text-sm sm:text-base">부가세</span>
                  <span className="text-slate-300 text-base sm:text-lg">{formatPrice(currentCart.total - Math.round(currentCart.total / 1.1))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-lg sm:text-xl">총 금액</span>
                  <span className="text-2xl sm:text-4xl font-bold text-emerald-400">{formatPrice(currentCart.total)}</span>
                </div>
              </div>

              {isEditingDetail ? (
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={async () => {
                      if (detailIndex !== null && editedDetailCart) {
                        // 총액 재계산
                        const newTotal = editedDetailCart.items.reduce((sum, item) => {
                          let price = 0;
                          if (editedDetailCart.priceType === 'wholesale' || editedDetailCart.price_type === 'wholesale') {
                            price = item.wholesale || item.price || item.unitPrice || 0;
                          } else {
                            price = item.retail || item.wholesale || item.price || item.unitPrice || 0;
                          }
                          return sum + (price * item.quantity);
                        }, 0);

                        const updatedCart = { ...editedDetailCart, total: newTotal };
                        await onUpdate(detailIndex, updatedCart);
                        setDetailCart(updatedCart);
                        setIsEditingDetail(false);
                        setEditedDetailCart(null);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-200"
                  >
                    <Save className="w-5 h-5 sm:w-6 sm:h-6" />
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingDetail(false);
                      setEditedDetailCart(null);
                      setShowProductSearchDetail(false);
                      setProductSearchTermDetail('');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 bg-slate-600 hover:bg-slate-500 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => { onLoad(currentCart); onBack(); }}
                    className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-base sm:text-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 active:translate-y-0 active:scale-95"
                  >
                    <Download className="w-5 h-5 sm:w-7 sm:h-7" />
                    불러오기
                  </button>
                  <button
                    onClick={() => {
                      if (detailIndex !== null) {
                        onDelete(detailIndex);
                        setDetailCart(null);
                        setDetailIndex(null);
                      }
                    }}
                    className="px-4 sm:px-6 py-3 sm:py-5 bg-red-600/20 hover:bg-red-600 rounded-xl text-red-400 hover:text-white transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 active:translate-y-0 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {/* 전체 삭제 확인 모달 */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-red-600/50 shadow-2xl shadow-red-500/20 overflow-hidden animate-scale-in">
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">전체 삭제</h2>
                  <p className="text-red-200 text-sm">되돌릴 수 없습니다</p>
                </div>
              </div>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-6">
              <p className="text-slate-300 text-center mb-2">
                모든 저장된 장바구니를 삭제하시겠습니까?
              </p>
              <p className="text-slate-500 text-sm text-center mb-6">
                총 <span className="text-red-400 font-bold">{savedCarts.length}개</span>의 장바구니가 삭제됩니다.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all hover-lift btn-ripple"
                >
                  취소
                </button>
                <button 
                  onClick={() => { onDeleteAll(); setShowDeleteAllConfirm(false); }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-all hover-lift btn-ripple hover:shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  전체 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 필터별 삭제 확인 모달 */}
      {showFilterDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-orange-500/50 shadow-2xl shadow-orange-500/20 overflow-hidden animate-scale-in">
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">⚠️ 장바구니 일괄 삭제</h2>
                  <p className="text-orange-200 text-sm">{getFilterLabel()} 장바구니 {filteredCarts.length}개</p>
                </div>
              </div>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-6">
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                <p className="text-slate-200 font-medium mb-2">다음 장바구니가 모두 삭제됩니다:</p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• 필터: <span className="text-white">{getFilterLabel()}</span></li>
                  <li>• 삭제 대상: <span className="text-orange-400 font-bold">{filteredCarts.length}개</span></li>
                  <li>• 총 금액: <span className="text-white">{formatPrice(filteredCarts.reduce((sum, c) => sum + (c.total || 0), 0))}</span></li>
                </ul>
                <p className="text-orange-400 text-xs mt-3">⚠️ 이 작업은 되돌릴 수 없습니다!</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowFilterDeleteConfirm(false)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all"
                >
                  취소
                </button>
                <button 
                  onClick={handleFilterDelete}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  삭제 실행
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 장바구니 저장 모달 ====================
// ==================== 거래처 목록 페이지 ====================
function CustomerListPage({ customers, orders = [], formatPrice, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 거래처
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false); // 상단 접기/펼치기

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedCustomer) {
          setSelectedCustomer(null);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, selectedCustomer]);
  
  // 검색 필터링 (띄어쓰기 무시)
  const filteredCustomers = (customers || []).filter(c => {
    const search = searchTerm.toLowerCase().replace(/\s/g, '');
    const name = c.name.toLowerCase().replace(/\s/g, '');
    const address = (c.address || '').toLowerCase().replace(/\s/g, '');
    const phone = (c.phone || '').replace(/\s/g, '');
    return name.includes(search) || address.includes(search) || phone.includes(search);
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col select-none">
      {/* 헤더 */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 select-none">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={selectedCustomer ? () => setSelectedCustomer(null) : onBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6 text-emerald-400" />
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {selectedCustomer ? selectedCustomer.name : '거래처 목록'}
                  </h1>
                  <p className="text-emerald-400 text-xs">
                    {selectedCustomer 
                      ? `주문 ${getCustomerOrders(selectedCustomer.name).length}건 / 총 ${formatPrice(getCustomerTotalAmount(selectedCustomer.name))}`
                      : `전체 ${customers?.length || 0}개 · 검색 ${filteredCustomers.length}개`
                    }
                  </p>
                </div>
              </div>
            </div>
            {/* 접기/펼치기 버튼 - 거래처 목록에서만 표시 */}
            {!selectedCustomer && (
              <button
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-1.5 text-sm"
              >
                <span className="hidden sm:inline">{isHeaderCollapsed ? '펼치기' : '접기'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderCollapsed ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          
          {/* 접힌 상태: 요약 정보 - 거래처 목록에서만 */}
          {!selectedCustomer && isHeaderCollapsed && (
            <div className="mt-2 flex items-center justify-between text-xs bg-slate-700/30 rounded-lg px-3 py-2">
              <span className="text-slate-400">
                거래처 <span className="text-white font-semibold">{filteredCustomers.length}개</span>
              </span>
              {searchTerm && <span className="text-emerald-400">검색: {searchTerm}</span>}
            </div>
          )}
        </div>
        
        {/* 검색 영역 - 거래처 목록에서만 표시 (접기/펼치기) */}
        {!selectedCustomer && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'}`}>
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="업체명, 주소, 전화번호로 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent="true">
        <div className="w-full px-4 py-4">
        {selectedCustomer ? (
          /* 거래처 주문 이력 */
          <>
            {/* 거래처 정보 */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
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
                    <span className="text-slate-300">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
              {selectedCustomer.memo && (
                <p className="text-slate-500 text-sm mt-2 pt-2 border-t border-slate-600">
                  메모: {selectedCustomer.memo}
                </p>
              )}
            </div>
            
            {/* 주문 이력 */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">
                주문 이력: <span className="text-white font-semibold">{getCustomerOrders(selectedCustomer.name).length}건</span>
              </p>
              {getCustomerOrders(selectedCustomer.name).length > 0 && (
                <button
                  onClick={() => {
                    const orders = getCustomerOrders(selectedCustomer.name);
                    const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    const allText = [
                      `[ ${selectedCustomer.name} 주문 이력 ]`,
                      `총 ${orders.length}건 / 총 금액: ${formatPrice(totalAmount)}`,
                      '',
                      ...orders.map((order, idx) => [
                        `━━━ ${idx + 1}. ${formatDate(order.createdAt)} ━━━`,
                        ...(order.items || []).map(item => `  ${item.name} x${item.quantity}  ${formatPrice(item.price * item.quantity)}`),
                        `  → 소계: ${formatPrice(order.totalAmount)}`,
                        order.memo ? `  메모: ${order.memo}` : ''
                      ].filter(Boolean)).flat()
                    ].join('\n');
                    navigator.clipboard.writeText(allText);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  전체 복사
                </button>
              )}
            </div>
            
            {getCustomerOrders(selectedCustomer.name).length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">주문 이력이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getCustomerOrders(selectedCustomer.name).map(order => {
                  const copyOrderText = () => {
                    const lines = [
                      formatDate(order.createdAt),
                      ...(order.items || []).map(item => `${item.name} x${item.quantity}  ${formatPrice(item.price * item.quantity)}`),
                      `총 금액: ${formatPrice(order.totalAmount)}`,
                      order.memo ? `메모: ${order.memo}` : ''
                    ].filter(Boolean).join('\n');
                    navigator.clipboard.writeText(lines);
                  };
                  
                  return (
                    <div key={order.orderNumber} className="bg-slate-800 rounded-xl p-4 border border-slate-700 group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{formatDate(order.createdAt)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={copyOrderText}
                            className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            title="주문 복사"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <span className="text-emerald-400 font-bold">{formatPrice(order.totalAmount)}</span>
                        </div>
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
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* 거래처 목록 */
          <>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">등록된 거래처가 없습니다</p>
                <p className="text-slate-500 text-sm mt-1">관리자 페이지에서 거래처를 추가하세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCustomers.map(customer => {
                  const orderCount = getCustomerOrders(customer.name).length;
                  const totalAmount = getCustomerTotalAmount(customer.name);
                  
                  return (
                    <div 
                      key={customer.id} 
                      onClick={() => setSelectedCustomer(customer)}
                      className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group hover:scale-[1.02] select-none"
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
          </>
        )}
        </div>
      </div>
    </div>
  );
}

// ==================== 택배 송장 생성 모달 ====================
function ShippingLabelPage({ orders = [], customers = [], formatPrice, onBack, refreshCustomers }) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [senderList] = useState(['무브모터스', '엠파츠']); // 보내는 곳 목록
  const [dateFilter, setDateFilter] = useState('today'); // 기본값: 오늘
  const [orderSettings, setOrderSettings] = useState({});
  const [editingCustomer, setEditingCustomer] = useState(null); // 수정 중인 고객
  const [tempAddress, setTempAddress] = useState('');
  const [tempPhone, setTempPhone] = useState('');

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);
  
  const safeOrders = orders || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // 고객 찾기 함수
  const findCustomer = (name) => {
    if (!name) return null;
    return (customers || []).find(c => c.name && c.name.toLowerCase().replace(/\s/g, '') === name.toLowerCase().replace(/\s/g, ''));
  };
  
  const filteredOrders = safeOrders.filter(order => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    if (dateFilter === 'today') return orderDate.getTime() === today.getTime();
    if (dateFilter === 'yesterday') return orderDate.getTime() === yesterday.getTime();
    if (dateFilter === 'week') return orderDate >= weekAgo;
    return true;
  });
  
  // 포장 입력값에 따른 택배비 계산 (입력 순서대로)
  const calculateShippingCost = (packaging) => {
    if (!packaging) return '7300';
    
    let costs = [];
    const input = String(packaging);
    
    // 박스와 나체의 위치 찾기
    const boxIndex = input.indexOf('박스');
    const nakedIndex = input.indexOf('나체');
    
    // 박스 금액 추가 함수
    const addBoxCosts = () => {
      const boxNum = input.match(/박스(\d)/);
      if (boxNum && boxNum[1]) {
        const count = parseInt(boxNum[1]) || 1;
        for (let i = 0; i < count; i++) {
          costs.push(7300);
        }
      }
    };
    
    // 나체 금액 추가 함수
    const addNakedCosts = () => {
      const nakedNum = input.match(/나체(\d)/);
      if (nakedNum && nakedNum[1]) {
        const count = parseInt(nakedNum[1]) || 1;
        for (let i = 0; i < count; i++) {
          costs.push(12000);
        }
      }
    };
    
    // 입력 순서대로 처리
    if (boxIndex >= 0 && nakedIndex >= 0) {
      // 둘 다 있을 때 - 먼저 나온 것부터 처리
      if (boxIndex < nakedIndex) {
        addBoxCosts();
        addNakedCosts();
      } else {
        addNakedCosts();
        addBoxCosts();
      }
    } else if (boxIndex >= 0) {
      addBoxCosts();
    } else if (nakedIndex >= 0) {
      addNakedCosts();
    }
    
    // 기본값
    if (costs.length === 0) {
      return '7300';
    }
    
    return costs.join(',');
  };
  
  const getOrderSetting = (orderNumber) => {
    const defaultPackaging = '박스1';
    return orderSettings[orderNumber] || { 
      paymentType: '착불', 
      packaging: defaultPackaging, 
      shippingCost: '7300',
      sender: senderList[0] // 기본 보내는 곳
    };
  };
  
  // 고객 정보 수정 시작
  const startEditCustomer = (customerName) => {
    const customer = customers.find(c => c.name === customerName);
    if (customer) {
      setEditingCustomer(customer.id);
      setTempAddress(customer.address || '');
      setTempPhone(customer.phone || '');
    }
  };

  // 고객 정보 수정 취소
  const cancelEditCustomer = () => {
    setEditingCustomer(null);
    setTempAddress('');
    setTempPhone('');
  };

  // 고객 정보 저장
  const saveCustomerInfo = async (customerId) => {
    try {
      const updated = await supabase.updateCustomer(customerId, {
        address: tempAddress,
        phone: tempPhone
      });

      if (updated) {
        // 즉시 고객 목록 새로고침
        if (refreshCustomers) {
          await refreshCustomers();
        }
        setEditingCustomer(null);
        setTempAddress('');
        setTempPhone('');
        showToast('✅ 업체 정보가 업데이트되었습니다', 'success');
      } else {
        showToast('⚠️ 업데이트 실패', 'error');
      }
    } catch (error) {
      console.error('고객 정보 업데이트 오류:', error);
      showToast('⚠️ 업데이트 실패', 'error');
    }
  };

  const updateOrderSetting = (orderNumber, field, value) => {
    setOrderSettings(prev => {
      const current = prev[orderNumber] || {
        paymentType: '착불',
        packaging: '박스1', 
        shippingCost: '7300',
        sender: senderList[0]
      };
      let updated = { ...current, [field]: value };
      
      // 포장 옵션이 변경되면 택배비 자동 계산
      if (field === 'packaging') {
        updated.shippingCost = calculateShippingCost(value);
      }
      
      return { ...prev, [orderNumber]: updated };
    });
  };
  
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) setSelectedOrders([]);
    else setSelectedOrders(filteredOrders.map(o => o.orderNumber));
  };
  
  const toggleOrder = (orderNumber) => {
    setSelectedOrders(prev => prev.includes(orderNumber) ? prev.filter(o => o !== orderNumber) : [...prev, orderNumber]);
  };
  
  const getMostExpensiveItem = (items) => {
    if (!items || items.length === 0) return '상품';
    return items.reduce((max, item) => item.price > max.price ? item : max, items[0]).name;
  };
  
  const generateShippingLabel = () => {
    const selectedData = selectedOrders.length > 0 
      ? filteredOrders.filter(o => selectedOrders.includes(o.orderNumber))
      : [];
    
    // 보내는 곳별로 그룹화
    const groupedBySender = {};
    senderList.forEach(sender => {
      groupedBySender[sender] = [];
    });
    selectedData.forEach(order => {
      const setting = getOrderSetting(order.orderNumber);
      const sender = setting.sender || senderList[0];
      if (groupedBySender[sender]) {
        groupedBySender[sender].push(order);
      }
    });
    
    let csv = '\uFEFF';
    
    // 항상 모든 보내는 곳 섹션 출력 (무브모터스 → 엠파츠 순서)
    senderList.forEach((sender, senderIndex) => {
      if (senderIndex > 0) csv += '\n'; // 그룹 간 빈 줄
      csv += '보내는곳 : ' + sender + '\n';
      csv += '번호,받는곳,배송,포장,운임,품명,연락처\n';
      
      const orders = groupedBySender[sender] || [];
      if (orders.length === 0) {
        // 주문이 없으면 빈 행 추가
        csv += ',,,,,, \n';
      } else {
        orders.forEach((order, index) => {
          const customer = findCustomer(order.customerName);
          const mostExpensive = getMostExpensiveItem(order.items);
          const phone = customer?.phone || order.customerPhone || '';
          const address = customer?.address || '';
          const setting = getOrderSetting(order.orderNumber);
          csv += `${index + 1},${order.customerName},${setting.paymentType},${setting.packaging},${setting.shippingCost},${mostExpensive},${phone}\n`;
          if (address) csv += `${address}\n`;
        });
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `택배송장_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const generateXlsxLabel = async () => {
    const selectedData = selectedOrders.length > 0 
      ? filteredOrders.filter(o => selectedOrders.includes(o.orderNumber))
      : [];
    if (!window.ExcelJS) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    const ExcelJS = window.ExcelJS;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('택배 송장');
    
    // A4 가로 방향 페이지 설정
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape', // 가로 방향
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true, // 가로 가운데 정렬
      verticalCentered: true,   // 세로 가운데 정렬
      margins: {
        left: 0.2,
        right: 0.2,
        top: 0.2,
        bottom: 0.2,
        header: 0.1,
        footer: 0.1
      }
    };
    
    // 컬럼 너비 설정 - 더 넓게 조정
    worksheet.columns = [
      { width: 7 },    // 번호
      { width: 22 },   // 받는곳
      { width: 11 },   // 배송
      { width: 13 },   // 포장
      { width: 18 },   // 운임
      { width: 28 },   // 품명
      { width: 22 }    // 연락처
    ];
    
    const thinBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    const headers = ['번호', '받는곳', '배송', '포장', '운임', '품명', '연락처'];
    
    // 보내는 곳별로 그룹화 (항상 모든 보내는 곳 초기화)
    const groupedBySender = {};
    senderList.forEach(sender => {
      groupedBySender[sender] = [];
    });
    selectedData.forEach(order => {
      const setting = getOrderSetting(order.orderNumber);
      const sender = setting.sender || senderList[0];
      if (groupedBySender[sender]) {
        groupedBySender[sender].push(order);
      }
    });
    
    let rowNum = 1;
    
    // 항상 모든 보내는 곳 섹션 출력 (무브모터스 → 엠파츠 순서)
    senderList.forEach((sender, senderIndex) => {
      // 그룹 간 빈 줄 추가 (첫 그룹 제외)
      if (senderIndex > 0) {
        rowNum++;
      }
      
      // 보내는 곳 헤더
      worksheet.mergeCells(`A${rowNum}:G${rowNum}`);
      const senderHeaderRow = worksheet.getRow(rowNum);
      senderHeaderRow.getCell(1).value = '보내는곳 : ' + sender;
      senderHeaderRow.getCell(1).font = { bold: true, size: 15, name: 'Malgun Gothic' };
      senderHeaderRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      // 배경색 제거
      // if (sender === '무브모터스') {
      //   senderHeaderRow.getCell(1).fill = {
      //     type: 'pattern',
      //     pattern: 'solid',
      //     fgColor: { argb: 'FFE8F5E9' } // 연한 초록색
      //   };
      // }
      senderHeaderRow.getCell(1).border = thinBorder;
      senderHeaderRow.height = 55;
      rowNum++;

      // 컬럼 헤더
      const colHeaderRow = worksheet.getRow(rowNum);
      headers.forEach((header, idx) => {
        const cell = colHeaderRow.getCell(idx + 1);
        cell.value = header;
        cell.font = { bold: true, size: 14, name: 'Malgun Gothic' };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = thinBorder;
      });
      colHeaderRow.height = 45;
      rowNum++;
      
      const orders = groupedBySender[sender] || [];
      
      if (orders.length === 0) {
        // 주문이 없으면 빈 행 추가
        const emptyRow = worksheet.getRow(rowNum);
        headers.forEach((_, idx) => {
          const cell = emptyRow.getCell(idx + 1);
          cell.value = '';
          cell.border = thinBorder;
        });
        emptyRow.height = 60;
        rowNum++;
      } else {
        // 해당 보내는 곳의 주문 데이터
        orders.forEach((order, index) => {
          const customer = order.customerName ? findCustomer(order.customerName) : null;
          const mostExpensive = getMostExpensiveItem(order.items);
          const phone = customer?.phone || order.customerPhone || '';
          const address = customer?.address || '';
          const setting = getOrderSetting(order.orderNumber);
          const isPrepaid = setting.paymentType === '선불';
          
          // 포장과 운임 쉼표로 분리
          const packagingValue = String(setting.packaging || '');
          const shippingCostValue = String(setting.shippingCost || '');
          
          // 쉼표가 있으면 줄바꿈 문자로 치환
          const packagingDisplay = packagingValue.includes(',') 
            ? packagingValue.split(',').join('\n') 
            : packagingValue;
          
          const shippingDisplay = shippingCostValue.includes(',') 
            ? shippingCostValue.split(',').join('\n') 
            : shippingCostValue;
          
          const dataRow = worksheet.getRow(rowNum);
          const rowData = [
            index + 1, 
            order.customerName || '', 
            setting.paymentType, 
            packagingDisplay, 
            shippingDisplay, 
            mostExpensive, 
            phone
          ];
          
          rowData.forEach((value, idx) => {
            const cell = dataRow.getCell(idx + 1);
            cell.value = value;
            cell.font = { size: 12, bold: isPrepaid, name: 'Malgun Gothic' };
            cell.alignment = { 
              horizontal: 'center', 
              vertical: 'middle',
              wrapText: true  // 줄바꿈 활성화
            };
            cell.border = thinBorder;
          });
          
          // 쉼표가 여러 개면 행 높이 증가
          const maxLines = Math.max(
            (packagingValue.match(/,/g) || []).length + 1,
            (shippingCostValue.match(/,/g) || []).length + 1
          );
          dataRow.height = Math.max(60, 35 * maxLines);
          rowNum++;
          
          // 주소 행 추가 (줄바꿈 적용)
          if (address) {
            worksheet.mergeCells(`A${rowNum}:G${rowNum}`);
            const addrRow = worksheet.getRow(rowNum);
            addrRow.getCell(1).value = address;
            addrRow.getCell(1).font = { size: 12, bold: isPrepaid, name: 'Malgun Gothic' };
            addrRow.getCell(1).alignment = { 
              horizontal: 'center', 
              vertical: 'middle',
              wrapText: true  // 줄바꿈 활성화
            };
            addrRow.getCell(1).border = thinBorder;
            addrRow.height = 50;
            rowNum++;
          }
        });
      }
    });

    // 바깥 테두리만 굵게 적용
    senderList.forEach((sender, senderIndex) => {
      const orders = groupedBySender[sender] || [];
      let startRow, endRow;

      // 각 섹션의 시작/끝 행 계산
      if (senderIndex === 0) {
        startRow = 1;
      } else {
        // 이전 섹션들의 행 수 계산
        let prevRows = 1; // 첫 섹션 시작
        for (let i = 0; i < senderIndex; i++) {
          const prevOrders = groupedBySender[senderList[i]] || [];
          prevRows += 1; // 빈 줄
          prevRows += 2; // 보내는곳 헤더 + 컬럼 헤더
          if (prevOrders.length === 0) {
            prevRows += 1; // 빈 데이터 행
          } else {
            prevOrders.forEach(order => {
              const customer = order.customerName ? findCustomer(order.customerName) : null;
              const address = customer?.address || '';
              prevRows += 1; // 데이터 행
              if (address) prevRows += 1; // 주소 행
            });
          }
        }
        startRow = prevRows;
      }

      // 현재 섹션 끝 행 계산
      endRow = startRow + 1; // 보내는곳 헤더 + 컬럼 헤더
      if (orders.length === 0) {
        endRow += 1; // 빈 데이터 행
      } else {
        orders.forEach(order => {
          const customer = order.customerName ? findCustomer(order.customerName) : null;
          const address = customer?.address || '';
          endRow += 1; // 데이터 행
          if (address) endRow += 1; // 주소 행
        });
      }

      // 바깥 테두리 굵게 적용
      for (let row = startRow; row <= endRow; row++) {
        for (let col = 1; col <= 7; col++) {
          const cell = worksheet.getRow(row).getCell(col);
          const border = { ...cell.border };

          // 상단 테두리
          if (row === startRow) {
            border.top = { style: 'medium' };
          }
          // 하단 테두리
          if (row === endRow) {
            border.bottom = { style: 'medium' };
          }
          // 좌측 테두리
          if (col === 1) {
            border.left = { style: 'medium' };
          }
          // 우측 테두리
          if (col === 7) {
            border.right = { style: 'medium' };
          }

          cell.border = border;
        }
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
    const selectedData = selectedOrders.length > 0 
      ? filteredOrders.filter(o => selectedOrders.includes(o.orderNumber))
      : [];
    
    // 보내는 곳별로 그룹화 (항상 모든 보내는 곳 초기화)
    const groupedBySender = {};
    senderList.forEach(sender => {
      groupedBySender[sender] = [];
    });
    selectedData.forEach(order => {
      const setting = getOrderSetting(order.orderNumber);
      const sender = setting.sender || senderList[0];
      if (groupedBySender[sender]) {
        groupedBySender[sender].push(order);
      }
    });
    
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>택배 송장</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0.5cm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Malgun Gothic', sans-serif;
      font-size: 11pt;
      padding: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      table-layout: fixed;
    }
    th, td {
      border: 1px solid #000;
      padding: 6px 4px;
      text-align: center;
      word-wrap: break-word;
      vertical-align: middle;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .header {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      padding: 12px;
    }
    .header-green {
      background-color: #e8f5e9;
    }
    .header-plain {
      background-color: transparent;
    }
    .prepaid {
      font-weight: bold;
    }
    .col-num { width: 5%; }
    .col-name { width: 18%; }
    .col-payment { width: 8%; }
    .col-pack { width: 10%; }
    .col-cost { width: 12%; }
    .col-item { width: 30%; }
    .col-phone { width: 17%; }
    .address-row {
      text-align: center;
      padding: 8px;
      word-break: keep-all;
      line-height: 1.4;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 0.5cm; }
    }
  </style>
</head>
<body>`;

    // 항상 모든 보내는 곳 섹션 출력 (무브모터스 → 엠파츠 순서)
    senderList.forEach((sender) => {
      const headerClass = sender === '무브모터스' ? 'header header-green' : 'header header-plain';
      html += `
  <table>
    <thead>
      <tr>
        <td colspan="7" class="${headerClass}">보내는곳 : ${sender}</td>
      </tr>
      <tr>
        <th class="col-num">번호</th>
        <th class="col-name">받는곳</th>
        <th class="col-payment">배송</th>
        <th class="col-pack">포장</th>
        <th class="col-cost">운임</th>
        <th class="col-item">품명</th>
        <th class="col-phone">연락처</th>
      </tr>
    </thead>
    <tbody>`;
    
      const orders = groupedBySender[sender] || [];
      
      if (orders.length === 0) {
        // 주문이 없으면 빈 행 추가
        html += `<tr>
          <td class="col-num"></td>
          <td class="col-name"></td>
          <td class="col-payment"></td>
          <td class="col-pack"></td>
          <td class="col-cost"></td>
          <td class="col-item"></td>
          <td class="col-phone"></td>
        </tr>`;
      } else {
        orders.forEach((order, index) => {
          const customer = findCustomer(order.customerName);
          const mostExpensive = getMostExpensiveItem(order.items);
          const phone = customer?.phone || order.customerPhone || '';
          const address = customer?.address || '';
          const setting = getOrderSetting(order.orderNumber);
          const isPrepaid = setting.paymentType === '선불';
          const rowClass = isPrepaid ? 'prepaid' : '';
          
          // 포장과 운임을 쉼표로 구분하여 줄바꿈 처리
          const packagingDisplay = String(setting.packaging || '').replace(/,/g, '<br>');
          const shippingDisplay = String(setting.shippingCost || '').replace(/,/g, '<br>');
          
          html += `<tr class="${rowClass}">
            <td class="col-num">${index + 1}</td>
            <td class="col-name">${order.customerName || ''}</td>
            <td class="col-payment">${setting.paymentType}</td>
            <td class="col-pack">${packagingDisplay}</td>
            <td class="col-cost">${shippingDisplay}</td>
            <td class="col-item">${mostExpensive}</td>
            <td class="col-phone">${phone}</td>
          </tr>`;
          if (address) html += `<tr class="${rowClass}"><td colspan="7" class="address-row">${address}</td></tr>`;
        });
      }
      
      html += `
    </tbody>
  </table>`;
    });
    
    html += `
  <script>
    window.onload = function() { 
      window.print(); 
    }
  </script>
</body>
</html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
  };
  
  const packagingOptions = ['박스1', '박스2', '박스3', '나체1', '나체2', '나체3'];
  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/70 backdrop-blur-sm" style={{ touchAction: 'none' }}>
      {/* 배경 오버레이 - 클릭 시 닫기 */}
      <div 
        className="absolute inset-0" 
        onClick={onBack}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">택배 송장 생성</h2>
              <p className="text-orange-100 text-xs">전체 {safeOrders.length}건 / 필터 {filteredOrders.length}건 / 선택 {selectedOrders.length}건</p>
            </div>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 스크롤 가능 영역 */}
        <div 
          className="flex-1 overflow-y-auto px-4 py-4 modal-scroll-area" 
          data-lenis-prevent="true"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}
        >
          {/* 날짜 필터 */}
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600">
            <div className="flex flex-wrap gap-2">
              {[{ key: 'today', label: '오늘' }, { key: 'yesterday', label: '어제' }, { key: 'week', label: '최근 7일' }, { key: 'all', label: '전체' }].map(({ key, label }) => (
                <button key={key} onClick={() => { setDateFilter(key); setSelectedOrders([]); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dateFilter === key ? 'bg-orange-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}>{label}</button>
              ))}
            </div>
          </div>
          
          {/* 전체 선택 */}
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-orange-500 focus:ring-orange-500" />
              <span className="text-slate-300 text-sm">전체 선택</span>
            </label>
          </div>
          
          {/* 주문 목록 */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">해당 기간 주문 내역이 없습니다</p>
              <p className="text-slate-500 text-sm mt-1">다른 날짜 필터를 선택해보세요</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredOrders.map(order => {
                const customer = order.customerName ? findCustomer(order.customerName) : null;
                const hasAddress = customer?.address;
                const setting = getOrderSetting(order.orderNumber);
                const isSelected = selectedOrders.includes(order.orderNumber);
                
                return (
                  <div key={order.orderNumber} className={`rounded-xl border transition-all select-none ${isSelected ? 'bg-orange-600/20 border-orange-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}>
                    <div className="p-3 cursor-pointer" onClick={() => toggleOrder(order.orderNumber)}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => {}} className="mt-1 w-4 h-4 rounded border-slate-500 bg-slate-700 text-orange-500" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium ${setting.paymentType === '선불' ? 'text-yellow-400 font-bold' : 'text-white'}`}>{order.customerName || '고객명 없음'}</span>
                            {/* 보내는 곳 배지 */}
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              (setting.sender || senderList[0]) === '엠파츠' 
                                ? 'bg-purple-600/30 text-purple-300' 
                                : 'bg-cyan-600/30 text-cyan-300'
                            }`}>
                              {setting.sender || senderList[0]}
                            </span>
                            {setting.paymentType === '선불' && <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 text-xs rounded-full font-bold">선불</span>}
                            {hasAddress ? <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-xs rounded-full">주소 있음</span> : <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded-full">주소 없음</span>}
                          </div>
                          <p className="text-slate-400 text-sm truncate">{customer?.address || '주소 미등록'}</p>
                          <p className="text-slate-500 text-xs mt-1">{order.items?.length || 0}종 · {formatPrice(order.totalAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">{customer?.phone || order.customerPhone || '번호 없음'}</p>
                          {customer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditCustomer(order.customerName);
                              }}
                              className="mt-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded transition-colors"
                            >
                              정보 수정
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="px-3 pb-3 pt-2 border-t border-slate-600/50" onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">📦 보내는 곳</label>
                            <select 
                              value={setting.sender || senderList[0]} 
                              onChange={(e) => updateOrderSetting(order.orderNumber, 'sender', e.target.value)} 
                              className="w-full px-2 py-1.5 bg-orange-600/20 border border-orange-500/50 rounded text-orange-300 text-sm font-medium focus:outline-none focus:border-orange-400"
                            >
                              {senderList.map(sender => <option key={sender} value={sender}>{sender}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">배송 방식</label>
                            <select value={setting.paymentType} onChange={(e) => updateOrderSetting(order.orderNumber, 'paymentType', e.target.value)} className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500">
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
                              onInput={(e) => updateOrderSetting(order.orderNumber, 'packaging', e.target.value)}
                              placeholder="박스1"
                              className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                            />
                            <datalist id={`packaging-options-${order.orderNumber}`}>
                              {packagingOptions.map(opt => <option key={opt} value={opt} />)}
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">택배비</label>
                            <input 
                              type="text" 
                              value={setting.shippingCost} 
                              onChange={(e) => {
                                const value = e.target.value;
                                // 숫자와 쉼표만 허용
                                if (value === '' || /^[\d,]+$/.test(value)) {
                                  updateOrderSetting(order.orderNumber, 'shippingCost', value);
                                }
                              }} 
                              placeholder="7300"
                              className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500" 
                            />
                          </div>
                        </div>

                        {/* 업체 정보 수정 폼 */}
                        {customer && editingCustomer === customer.id && (
                          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                            <p className="text-blue-400 font-medium text-sm mb-2">📝 {order.customerName} 정보 수정</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-slate-400 text-xs mb-1">주소</label>
                                <input
                                  type="text"
                                  value={tempAddress}
                                  onChange={(e) => setTempAddress(e.target.value)}
                                  placeholder="주소를 입력하세요"
                                  className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-xs mb-1">전화번호</label>
                                <input
                                  type="text"
                                  value={tempPhone}
                                  onChange={(e) => setTempPhone(e.target.value)}
                                  placeholder="전화번호를 입력하세요"
                                  className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveCustomerInfo(customer.id)}
                                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={cancelEditCustomer}
                                  className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded transition-colors"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="border-t border-slate-700 p-4 flex-shrink-0 bg-slate-800">
          <p className="text-slate-400 text-xs text-center mb-2">
            {selectedOrders.length === 0 ? '주문을 선택하지 않으면 빈 양식이 출력됩니다' : `${selectedOrders.length}건 선택됨`}
          </p>
          <div className="flex gap-2">
            <button onClick={generateShippingLabel} className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"><Download className="w-5 h-5" />CSV</button>
            <button onClick={generateXlsxLabel} className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors bg-blue-600 hover:bg-blue-500 text-white"><FileText className="w-5 h-5" />Excel</button>
            <button onClick={printShippingLabels} className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors bg-orange-600 hover:bg-orange-500 text-white"><Printer className="w-5 h-5" />인쇄</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 재고 현황 페이지 ====================
function StockOverviewPage({ products, categories, formatPrice, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [stockFilter, setStockFilter] = useState('all'); // all, normal, low, out
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false); // 상단 접기/펼치기

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);
  
  // 필터링된 제품
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;

    // 특수문자 제거 및 띄어쓰기 제거
    const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');
    const productName = normalizeText(p.name);

    // 검색어를 단어별로 분리
    const searchWords = searchTerm.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

    // 모든 검색 단어가 제품명에 포함되어 있는지 확인 (순서 무관)
    const matchesSearch = searchWords.every(word => {
      const normalizedWord = normalizeText(word);
      return productName.includes(normalizedWord);
    });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col select-none">
      {/* 헤더 */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 select-none">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-cyan-400" />
                <div>
                  <h1 className="text-lg font-bold text-white">재고 현황</h1>
                  <p className="text-cyan-400 text-xs">전체 {products.length}개 · 검색 {filteredProducts.length}개</p>
                </div>
              </div>
            </div>
            {/* 접기/펼치기 버튼 */}
            <button
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-1.5 text-sm"
            >
              <span className="hidden sm:inline">{isHeaderCollapsed ? '펼치기' : '접기'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* 접힌 상태: 요약 정보 */}
          {isHeaderCollapsed && (
            <div className="mt-2 flex items-center justify-between text-xs bg-slate-700/30 rounded-lg px-3 py-2">
              <span className="text-slate-400">
                <span className="text-white font-semibold">{stats.total}개</span> · 
                <span className="text-emerald-400 ml-1">{stats.normal} 정상</span> · 
                <span className="text-yellow-400">{stats.low} 부족</span> · 
                <span className="text-red-400">{stats.out} 품절</span>
              </span>
              {searchTerm && <span className="text-cyan-400">검색: {searchTerm}</span>}
            </div>
          )}
        </div>
        
        {/* 통계 + 검색 + 필터 영역 - 접기/펼치기 */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
          <div className="px-4 pb-4 pt-2 space-y-3">
            {/* 재고 통계 카드 */}
            <div className="grid grid-cols-4 gap-2 mt-1">
              <button onClick={() => setStockFilter('all')} className={`rounded-lg p-2.5 text-center transition-all border ${stockFilter === 'all' ? 'ring-2 ring-white bg-slate-700 border-slate-500' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'}`}>
                <p className="text-slate-400 text-xs mb-0.5">전체</p>
                <p className="text-lg font-bold text-white">{stats.total}</p>
              </button>
              <button onClick={() => setStockFilter('normal')} className={`rounded-lg p-2.5 text-center transition-all border ${stockFilter === 'normal' ? 'ring-2 ring-emerald-400 bg-emerald-600/30 border-emerald-500' : 'bg-emerald-600/20 border-emerald-600/30 hover:bg-emerald-600/30'}`}>
                <p className="text-emerald-300 text-xs mb-0.5">정상</p>
                <p className="text-lg font-bold text-emerald-400">{stats.normal}</p>
              </button>
              <button onClick={() => setStockFilter('low')} className={`rounded-lg p-2.5 text-center transition-all border ${stockFilter === 'low' ? 'ring-2 ring-yellow-400 bg-yellow-600/30 border-yellow-500' : 'bg-yellow-600/20 border-yellow-600/30 hover:bg-yellow-600/30'}`}>
                <p className="text-yellow-300 text-xs mb-0.5">부족</p>
                <p className="text-lg font-bold text-yellow-400">{stats.low}</p>
              </button>
              <button onClick={() => setStockFilter('out')} className={`rounded-lg p-2.5 text-center transition-all border ${stockFilter === 'out' ? 'ring-2 ring-red-400 bg-red-600/30 border-red-500' : 'bg-red-600/20 border-red-600/30 hover:bg-red-600/30'}`}>
                <p className="text-red-300 text-xs mb-0.5">품절</p>
                <p className="text-lg font-bold text-red-400">{stats.out}</p>
              </button>
            </div>
            
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="제품 검색..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            {/* 카테고리 필터 - PC: flex-wrap, 모바일: 가로 스크롤 */}
            <div className="flex gap-2 overflow-x-auto md:overflow-x-visible md:flex-wrap pb-1 md:pb-0 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              <button
                onClick={() => setSelectedCategory('전체')}
                className={`flex-shrink-0 md:flex-shrink px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === '전체' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                전체
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 md:flex-shrink px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 스크롤 영역: 제품 목록 */}
      <div className="flex-1 overflow-y-auto" data-lenis-prevent="true">
        <div className="w-full px-4 py-4">
          <p className="text-slate-400 text-sm mb-3">
            {selectedCategory !== '전체' && <span className="text-cyan-400">{selectedCategory}</span>}
            {selectedCategory !== '전체' && ' · '}
            검색 결과: <span className="text-white font-semibold">{filteredProducts.length}개</span>
          </p>
        
        {/* 제품 목록 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">해당 조건의 제품이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredProducts.map(product => {
              const stock = product.stock ?? 50;
              const minStock = product.min_stock || 5;
              const isOut = stock === 0;
              const isLow = stock > 0 && stock <= minStock;
              
              return (
                <div 
                  key={product.id} 
                  className={`rounded-xl p-4 border transition-transform hover:scale-[1.02] ${
                    isOut ? 'bg-red-900/20 border-red-500/30' :
                    isLow ? 'bg-yellow-900/20 border-yellow-500/30' :
                    'bg-emerald-900/10 border-emerald-500/20'
                  }`}
                >
                  <p className="text-white text-sm font-medium truncate mb-2">{product.name}</p>
                  <p className="text-slate-400 text-xs truncate mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 text-xs">{formatPrice(product.wholesale)}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isOut ? 'bg-red-600/30 text-red-400' :
                      isLow ? 'bg-yellow-600/30 text-yellow-400' :
                      'bg-emerald-600/30 text-emerald-400'
                    }`}>
                      {isOut ? '품절' : `${stock}개`}
                    </span>
                  </div>
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

// ==================== 장바구니 저장 모달 ====================
function SaveCartModal({ isOpen, onSave, cart, priceType, formatPrice, customerName = '', onBack, onCloseAll }) {
  const [cartName, setCartName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('normal');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    // 고객명이 있으면 고객명으로, 없으면 날짜로
    if (customerName && customerName.trim()) {
      setCartName(customerName.trim());
    } else {
      const now = new Date();
      const defaultName = `${now.getMonth() + 1}월 ${now.getDate()}일 ${now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
      setCartName(defaultName);
    }

    // 기본 배송 예정일: 오늘 (당일)
    const today = new Date();
    setDeliveryDate(today.toISOString().split('T')[0]);

    // 초기화 - 기본 상태를 '작성중'으로 설정
    setStatus('pending');
    setPriority('normal');
    setMemo('');
  }, [customerName, isOpen]);

  // ESC/Enter 키 이벤트
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      } else if (e.key === 'Enter' && cartName.trim()) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onBack, cartName]);
  
  const total = cart.reduce((sum, item) => {
    const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
    return sum + (price * item.quantity);
  }, 0);
  
  const handleSave = async () => {
    if (!cartName.trim()) return;
    await onSave({
      name: cartName.trim(),
      deliveryDate,
      status,
      priority,
      memo: memo.trim()
    });
    // 장바구니 저장 후 메인 페이지로 복귀 (주문서 모달도 닫기)
    if (onCloseAll) {
      onCloseAll();
    } else {
      onBack();
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ touchAction: 'none' }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onBack} />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-fade-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">장바구니 저장</h2>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">저장 이름</label>
            <input
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="고객명 또는 저장명 입력"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </div>

          {/* 배송 예정일 */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">배송 예정일</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* 상태 & 우선순위 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="draft">작성 중</option>
                <option value="scheduled">예약됨</option>
                <option value="ready">준비 완료</option>
                <option value="hold">보류</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">우선순위</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="low">낮음</option>
                <option value="normal">보통</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
              </select>
            </div>
          </div>

          {/* 메모 */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="배송 관련 메모 (선택)"
              rows="2"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">상품</span>
              <span className="text-white">{cart.length}종 / {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">합계</span>
              <span className="text-emerald-400 font-bold text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="bg-slate-900/30 rounded-xl p-3 mb-5 border border-slate-700/50 max-h-32 overflow-y-auto">
            <p className="text-slate-400 text-sm">
              {cart.map(item => `${item.name}(${item.quantity})`).join(', ')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!cartName.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
            >
              <Save className="w-5 h-5" />
              저장하기
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 알림 설정 모달 ====================
function NotificationSettingsModal({ isOpen, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const toggleDayReminder = (day) => {
    const newDays = localSettings.daysBeforeReminder.includes(day)
      ? localSettings.daysBeforeReminder.filter(d => d !== day)
      : [...localSettings.daysBeforeReminder, day].sort((a, b) => a - b);
    setLocalSettings({ ...localSettings, daysBeforeReminder: newDays });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in" style={{ touchAction: 'none' }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-lg overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-500/10 animate-scale-in">
        {/* 헤더 */}
        <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 px-6 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">알림 설정</h2>
                <p className="text-blue-100 text-xs">배송 일정을 놓치지 마세요</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 알림 활성화 - 고급 스위치 */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-5 border border-slate-600/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-lg">배송 알림</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    localSettings.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-600/30 text-slate-400'
                  }`}>
                    {localSettings.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">브라우저 알림으로 배송 일정을 알려드립니다</p>
              </div>
              <button
                onClick={() => setLocalSettings({ ...localSettings, enabled: !localSettings.enabled })}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                  localSettings.enabled
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/50'
                    : 'bg-slate-600 shadow-slate-900/50'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                  localSettings.enabled ? 'left-9' : 'left-1'
                }`}>
                  <div className={`w-full h-full flex items-center justify-center ${
                    localSettings.enabled ? 'text-blue-500' : 'text-slate-400'
                  }`}>
                    {localSettings.enabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {localSettings.enabled && (
            <>
              {/* 알림 시간 - 개선된 UI */}
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl p-5 border border-slate-600/20">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <label className="text-white font-semibold text-base">알림 시간</label>
                </div>
                <div className="relative">
                  <input
                    type="time"
                    value={localSettings.time}
                    onChange={(e) => setLocalSettings({ ...localSettings, time: e.target.value })}
                    className="w-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-600/50 rounded-xl px-5 py-4 text-white text-xl font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner"
                    style={{
                      colorScheme: 'dark'
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <p className="text-slate-400 text-sm">매일 이 시간에 알림을 전송합니다</p>
                </div>
              </div>

              {/* 알림 조건 - 고급스러운 카드 */}
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl p-5 border border-slate-600/20">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <label className="text-white font-semibold text-base">알림 받을 배송 일정</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { day: -1, label: '지연 배송', icon: '🔴', bgFrom: 'from-red-500/20', bgTo: 'to-red-600/10', border: 'border-red-500/30', text: 'text-red-400', checked: 'bg-red-500' },
                    { day: 0, label: '오늘', icon: '⚡', bgFrom: 'from-orange-500/20', bgTo: 'to-orange-600/10', border: 'border-orange-500/30', text: 'text-orange-400', checked: 'bg-orange-500' },
                    { day: 1, label: '내일', icon: '🟡', bgFrom: 'from-yellow-500/20', bgTo: 'to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', checked: 'bg-yellow-500' },
                    { day: 2, label: 'D-2', icon: '📅', bgFrom: 'from-blue-500/20', bgTo: 'to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400', checked: 'bg-blue-500' },
                    { day: 3, label: 'D-3', icon: '📆', bgFrom: 'from-cyan-500/20', bgTo: 'to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', checked: 'bg-cyan-500' },
                    { day: 7, label: 'D-7', icon: '📋', bgFrom: 'from-purple-500/20', bgTo: 'to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400', checked: 'bg-purple-500' }
                  ].map(({ day, label, icon, bgFrom, bgTo, border, text, checked }) => {
                    const isActive = day === -1 ? localSettings.includeOverdue : localSettings.daysBeforeReminder.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (day === -1) {
                            setLocalSettings({ ...localSettings, includeOverdue: !localSettings.includeOverdue });
                          } else {
                            toggleDayReminder(day);
                          }
                        }}
                        className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-br ${bgFrom} ${bgTo} ${border} shadow-lg scale-[1.02]`
                            : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">{icon}</span>
                          <span className={`font-bold text-sm ${isActive ? text : 'text-slate-400'}`}>
                            {label}
                          </span>
                        </div>
                        {isActive && (
                          <div className={`absolute top-2 right-2 w-5 h-5 ${checked} rounded-full flex items-center justify-center shadow-lg`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-slate-400 text-xs mt-3 text-center">선택한 일정에 대해 알림을 받습니다</p>
              </div>

              {/* 알림 빈도 - 고급 카드 */}
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl p-5 border border-slate-600/20">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                  <label className="text-white font-semibold text-base">알림 빈도</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, dailyNotification: true })}
                    className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200 ${
                      localSettings.dailyNotification
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 shadow-lg scale-[1.02]'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-3xl ${localSettings.dailyNotification ? 'animate-pulse' : ''}`}>🔔</div>
                      <div className="text-center">
                        <p className={`font-bold text-sm ${localSettings.dailyNotification ? 'text-blue-400' : 'text-slate-400'}`}>
                          매일 알림
                        </p>
                        <p className="text-xs text-slate-500 mt-1">정기 알림</p>
                      </div>
                    </div>
                    {localSettings.dailyNotification && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, dailyNotification: false })}
                    className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200 ${
                      !localSettings.dailyNotification
                        ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 shadow-lg scale-[1.02]'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-3xl ${!localSettings.dailyNotification ? 'animate-pulse' : ''}`}>📅</div>
                      <div className="text-center">
                        <p className={`font-bold text-sm ${!localSettings.dailyNotification ? 'text-cyan-400' : 'text-slate-400'}`}>
                          당일만
                        </p>
                        <p className="text-xs text-slate-500 mt-1">배송일만</p>
                      </div>
                    </div>
                    {!localSettings.dailyNotification && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 버튼 - 고급스러운 스타일 */}
        <div className="p-6 border-t border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-300 font-semibold transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-white font-bold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              💾 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== AI 주문 인식 페이지 ====================
function TextAnalyzePage({ products, onAddToCart, formatPrice, priceType, initialText = '', onBack }) {
  const [inputText, setInputText] = useState(initialText || '');
  const [analyzedItems, setAnalyzedItems] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchingIndex, setSearchingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // 모달 열릴 때 body 스크롤 방지 (모바일 최적화)
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    
    // body에 modal-open 클래스 추가
    body.classList.add('modal-open');
    body.style.top = `-${scrollY}px`;
    
    // 터치 이벤트 방지 핸들러
    const preventTouchMove = (e) => {
      const target = e.target;
      // 스크롤 가능한 영역 내부에서는 허용
      if (target.closest('.modal-scroll-area') || target.closest('[data-lenis-prevent]')) {
        return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    return () => {
      body.classList.remove('modal-open');
      body.style.top = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

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

      const qtyPatterns = [
        /(\d+)\s*개/,
        /(\d+)\s*세트/,
        /(\d+)\s*ea/i,
        /(\d+)\s*EA/,
        /(\d+)\s*$/,
        /^(\d+)\s+/,
        /[x×]\s*(\d+)/i,
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

      searchText = searchText
        .replace(/[,.\-_\/\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!searchText) return;

      // 특수문자 제거 및 띄어쓰기 제거
      const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');

      // 검색어를 단어별로 분리
      const searchWords = searchText.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

      let bestMatch = null;
      let bestScore = 0;

      products.forEach(product => {
        const productName = normalizeText(product.name);
        let score = 0;

        // 모든 검색 단어가 제품명에 포함되어 있는지 확인 (순서 무관)
        const allWordsMatched = searchWords.every(word => {
          const normalizedWord = normalizeText(word);
          return productName.includes(normalizedWord);
        });

        if (allWordsMatched) {
          // 일치하는 단어가 많을수록 점수 증가
          searchWords.forEach(word => {
            const normalizedWord = normalizeText(word);
            if (productName.includes(normalizedWord)) {
              score += word.length;
            }
          });

          // 완전 일치 시 보너스 점수
          const searchNormalized = normalizeText(searchText);
          if (productName.includes(searchNormalized)) {
            score += 10;
          }
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
        selected: bestScore > 0
      });
    });

    setAnalyzedItems(results);
    setIsAnalyzing(false);
  };

  const toggleSelect = (index) => {
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: qty } : item
    ));
  };

  const removeItem = (index) => {
    setAnalyzedItems(prev => prev.filter((_, i) => i !== index));
    if (searchingIndex === index) {
      setSearchingIndex(null);
      setSearchQuery('');
    }
  };

  const selectProduct = (index, product) => {
    setAnalyzedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, matchedProduct: product, selected: true, score: 100 } : item
    ));
    setSearchingIndex(null);
    setSearchQuery('');
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    // 특수문자 제거 및 띄어쓰기 제거
    const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');

    // 검색어를 단어별로 분리
    const searchWords = searchQuery.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

    return products.filter(p => {
      const productName = normalizeText(p.name);

      // 모든 검색 단어가 제품명에 포함되어 있는지 확인 (순서 무관)
      return searchWords.every(word => {
        const normalizedWord = normalizeText(word);
        return productName.includes(normalizedWord);
      });
    }).slice(0, 8);
  };

  const addSelectedToCart = () => {
    const selectedItems = analyzedItems.filter(item => item.selected && item.matchedProduct);
    selectedItems.forEach(item => {
      onAddToCart(item.matchedProduct, item.quantity);
    });
    onBack();
  };

  const selectedCount = analyzedItems.filter(item => item.selected && item.matchedProduct).length;
  const searchResults = getSearchResults();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/70 backdrop-blur-sm" style={{ touchAction: 'none' }}>
      {/* 배경 오버레이 - 클릭 시 닫기 */}
      <div 
        className="absolute inset-0" 
        onClick={onBack}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      <div className="relative bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white">AI 주문 인식</h1>
              <p className="text-purple-100 text-xs">메모를 붙여넣으면 자동으로 제품을 찾아드려요</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-lg">{selectedCount}개 선택</span>
            )}
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 입력 영역 & 분석 버튼 - 고정 */}
        <div className="flex-shrink-0 px-4 pt-4 bg-slate-800">
          {/* 입력 영역 */}
          <div className="mb-3">
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
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
            />
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={analyzeText}
            disabled={!inputText.trim() || isAnalyzing}
            className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all mb-3 ${
              !inputText.trim() || isAnalyzing
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30'
            }`}
          >
            {isAnalyzing ? (
              <><RefreshCw className="w-5 h-5 animate-spin" />분석 중...</>
            ) : (
              <><Sparkles className="w-5 h-5" />텍스트 분석하기</>
            )}
          </button>
        </div>

        {/* 분석 결과 - 스크롤 영역 */}
        <div 
          className="flex-1 overflow-y-auto px-4 pb-4 modal-scroll-area" 
          data-lenis-prevent="true"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}
        >

        {/* 분석 결과 */}
        {analyzedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                분석 결과 ({analyzedItems.length}줄)
              </h3>
            </div>

            <div className="space-y-2">
              {analyzedItems.map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl border transition-all ${
                    item.matchedProduct 
                      ? item.selected 
                        ? 'bg-purple-900/30 border-purple-500/50' 
                        : 'bg-slate-800 border-slate-700'
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
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
                      <p className="text-slate-400 text-xs mb-1 truncate">"{item.originalText}"</p>
                      
                      {item.matchedProduct ? (
                        <div className="space-y-2">
                          {/* 첫째 줄: 제품명 + 변경 버튼 */}
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium truncate flex-1">{item.matchedProduct.name}</p>
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
                          
                          {/* 둘째 줄: 가격 + 수량 + 삭제 */}
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-medium ${priceType === 'wholesale' ? 'text-blue-400' : 'text-red-400'}`}>
                              {formatPrice(priceType === 'wholesale' ? item.matchedProduct.wholesale : (item.matchedProduct.retail || item.matchedProduct.wholesale))}
                            </p>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
                                <button 
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded"
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
                                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded"
                                >
                                  <Plus className="w-3 h-3 text-white" />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeItem(index)}
                                className="w-7 h-7 flex items-center justify-center bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-colors"
                              >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
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
                            <button 
                              onClick={() => removeItem(index)}
                              className="w-7 h-7 flex items-center justify-center bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 검색 드롭다운 */}
                      {searchingIndex === index && (
                        <div className="mt-2 p-2 bg-slate-900 rounded-lg border border-slate-600">
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
                            <div className="max-h-40 overflow-y-auto space-y-1">
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

        {/* 하단 버튼 영역 */}
        {analyzedItems.length > 0 && (
          <div className="border-t border-slate-700 p-4 flex-shrink-0 bg-slate-800">
            <button
              onClick={addSelectedToCart}
              disabled={selectedCount === 0}
              className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                selectedCount === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg'
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

// ==================== 주문 확인 페이지 ====================
function OrderPage({ cart, priceType, totalAmount, formatPrice, onSaveOrder, isSaving, onUpdateQuantity, onRemoveItem, onAddItem, products, onSaveCart, customers = [], onBack }) {
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
  const [changingItemId, setChangingItemId] = useState(null); // 변경 중인 제품 ID
  const [changeSearchQuery, setChangeSearchQuery] = useState(''); // 변경 검색어

  // 처음 마운트시 주문번호 생성
  useEffect(() => {
    if (!orderNumber) {
      const today = new Date();
      const newOrderNumber = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      setOrderNumber(newOrderNumber);
    }
  }, []);

  // ESC 키로 뒤로가기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    
    // body에 modal-open 클래스 추가
    body.classList.add('modal-open');
    body.style.top = `-${scrollY}px`;
    
    // 터치 이벤트 방지 핸들러
    const preventTouchMove = (e) => {
      const target = e.target;
      // 스크롤 가능한 영역 내부에서는 허용
      if (target.closest('.modal-scroll-area') || target.closest('[data-lenis-prevent]')) {
        return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    return () => {
      body.classList.remove('modal-open');
      body.style.top = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

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

  // 검색 결과 필터링 (특수문자 무시, 단어 순서 무관)
  const searchResults = productSearch.length >= 1
    ? products.filter(p => {
        // 특수문자 제거 및 띄어쓰기 제거
        const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');
        const productName = normalizeText(p.name);
        const productCategory = normalizeText(p.category);

        // 검색어를 단어별로 분리
        const searchWords = productSearch.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

        // 모든 검색 단어가 제품명이나 카테고리에 포함되어 있는지 확인 (순서 무관)
        return searchWords.every(word => {
          const normalizedWord = normalizeText(word);
          return productName.includes(normalizedWord) || productCategory.includes(normalizedWord);
        });
      }).slice(0, 8)
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
      existingCustomerId: selectedCustomerId,
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
      onBack();
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
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      style={{ touchAction: 'none' }}
      onClick={onBack}
      onTouchMove={(e) => {
        // 스크롤 영역 내부가 아니면 이벤트 방지
        if (!e.target.closest('.modal-scroll-area')) {
          e.preventDefault();
        }
      }}
    >
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <h1 className="text-lg font-bold text-white">주문서</h1>
                  <p className="text-blue-400 text-xs">{orderNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xl font-bold text-white">{formatPrice(currentTotal)}</p>
                <p className="text-slate-400 text-xs">{totalQuantity}개</p>
              </div>
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </header>

        <div 
          className="flex-1 overflow-y-auto px-4 py-4 modal-scroll-area" 
          data-lenis-prevent="true"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }} 
          onClick={() => { setShowSearchResults(false); setShowCustomerSuggestions(false); }}
        >
        {/* 고객 정보 */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-slate-400 text-xs mb-1 flex items-center gap-1">
                <Building className="w-3 h-3" />
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
                className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedCustomerId ? 'border-emerald-500' : 'border-slate-600'}`}
              />
              {selectedCustomerId && (
                <span className="absolute right-3 top-7 text-emerald-400">
                  <Check className="w-4 h-4" />
                </span>
              )}
              {customerName && !selectedCustomerId && !showCustomerSuggestions && customerSuggestions.length === 0 && (
                <span className="absolute right-3 top-7 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                  🆕 신규
                </span>
              )}
              {showCustomerSuggestions && customerSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {customerSuggestions.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className="w-full px-3 py-2.5 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium text-sm">{customer.name}</p>
                        {customer.phone && (
                          <span className="text-emerald-400 text-xs">{customer.phone}</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{customer.address || '주소 미등록'}</p>
                    </button>
                  ))}
                </div>
              )}
              {showCustomerSuggestions && customerName.length >= 2 && customerSuggestions.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-blue-500/50 rounded-lg shadow-xl p-3">
                  <p className="text-blue-400 text-sm flex items-center gap-2">
                    <span>🆕</span>
                    <span>"{customerName}" - 신규 업체로 자동 등록됩니다</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                연락처
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="연락처 입력"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-slate-400 text-xs mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              배송 주소
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="배송 주소 입력 (택배 발송시 필수)"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 제품 추가 검색 */}
        <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="제품 추가 검색..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />
            {productSearch && (
              <button onClick={() => { setProductSearch(''); setShowSearchResults(false); }}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
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
                    className={`flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-0 ${isInCart ? 'opacity-50' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.name}</p>
                      <p className="text-slate-500 text-xs">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-sm font-medium">{formatPrice(price)}</span>
                      {isInCart ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">추가됨</span>
                      ) : (
                        <Plus className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 상품 목록 */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            주문 상품 ({cart.length}종 / {totalQuantity}개)
          </h3>
          
          <div className="space-y-2">
            {cart.length === 0 ? (
              <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400">주문 상품이 없습니다</p>
              </div>
            ) : (
              cart.map((item) => {
                const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
                const itemTotal = price * item.quantity;
                const isChanging = changingItemId === item.id;
                
                // 변경 시 검색 결과 (특수문자 무시, 단어 순서 무관)
                const changeSearchResults = isChanging && changeSearchQuery.trim()
                  ? products.filter(p => {
                      if (p.id === item.id) return false; // 현재 제품 제외
                      if (cart.some(c => c.id === p.id)) return false; // 장바구니에 있는 제품 제외

                      // 특수문자 제거 및 띄어쓰기 제거
                      const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');
                      const productName = normalizeText(p.name);
                      const productCategory = normalizeText(p.category || '');

                      // 검색어를 단어별로 분리
                      const searchWords = changeSearchQuery.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

                      // 모든 검색 단어가 제품명이나 카테고리에 포함되어 있는지 확인 (순서 무관)
                      return searchWords.every(word => {
                        const normalizedWord = normalizeText(word);
                        return productName.includes(normalizedWord) || productCategory.includes(normalizedWord);
                      });
                    }).slice(0, 8)
                  : [];
                
                return (
                  <div key={item.id} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                    {/* 상단: 상품명 + 변경/삭제 버튼 */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.name}</p>
                        <p className="text-blue-400 text-sm mt-0.5">
                          {formatPrice(price)} <span className="text-slate-500 text-xs">(VAT제외 {formatPrice(Math.round(price / 1.1))})</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => {
                            if (isChanging) {
                              setChangingItemId(null);
                              setChangeSearchQuery('');
                            } else {
                              setChangingItemId(item.id);
                              setChangeSearchQuery('');
                            }
                          }}
                          className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors ${
                            isChanging 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400'
                          }`}
                          title="제품 변경"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* 제품 변경 UI */}
                    {isChanging && (
                      <div className="mb-3 relative">
                        <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-blue-500/50">
                          <Search className="w-4 h-4 text-blue-400" />
                          <input
                            type="text"
                            value={changeSearchQuery}
                            onChange={(e) => setChangeSearchQuery(e.target.value)}
                            placeholder="변경할 제품 검색..."
                            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                            autoFocus
                          />
                          {changeSearchQuery && (
                            <button onClick={() => setChangeSearchQuery('')}>
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                        </div>
                        
                        {/* 검색 결과 */}
                        {changeSearchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                            {changeSearchResults.map(product => {
                              const productPrice = priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
                              return (
                                <div 
                                  key={product.id}
                                  onClick={() => {
                                    // 기존 제품 삭제 후 새 제품 추가 (수량 유지)
                                    const currentQty = item.quantity;
                                    onRemoveItem(item.id);
                                    onAddItem(product);
                                    // 수량 조절
                                    setTimeout(() => {
                                      if (currentQty > 1) {
                                        onUpdateQuantity(product.id, currentQty);
                                      }
                                    }, 50);
                                    setChangingItemId(null);
                                    setChangeSearchQuery('');
                                  }}
                                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-0"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                                    <p className="text-slate-500 text-xs">{product.category}</p>
                                  </div>
                                  <span className="text-blue-400 text-sm font-medium ml-2">{formatPrice(productPrice)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {changeSearchQuery && changeSearchResults.length === 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl p-3 text-center text-slate-400 text-sm">
                            검색 결과가 없습니다
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* 하단: 수량 조절 + 소계 */}
                    <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= 0) onUpdateQuantity(item.id, val);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-14 h-9 text-center text-white text-lg font-bold bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">소계</p>
                        <p className="text-emerald-400 font-bold text-lg">{formatPrice(itemTotal)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 메모 */}
        <div className="mb-4">
          <label className="block text-slate-400 text-xs mb-1">메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="추가 메모 입력 (선택)"
            rows={2}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 금액 요약 */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">공급가액</span>
            <span className="text-white">{formatPrice(exVat)}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">부가세 (10%)</span>
            <span className="text-white">{formatPrice(vat)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <span className="text-white font-semibold">총 금액</span>
            <span className="text-2xl font-bold text-emerald-400">{formatPrice(currentTotal)}</span>
          </div>
        </div>
        </div>

        {/* 하단 버튼 영역 (모달 푸터) */}
        <div className="bg-slate-800 border-t border-slate-700 p-4 flex-shrink-0">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving || cart.length === 0}
                className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
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
                className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />담기
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopy}
                disabled={cart.length === 0}
                className={`py-2.5 rounded-xl font-medium flex items-center justify-center gap-1 text-sm transition-all ${
                  copied ? 'bg-green-600 text-white' : 
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {copied ? <><Check className="w-4 h-4" />완료</> : <><Copy className="w-4 h-4" />복사</>}
              </button>
              <button
                onClick={handlePrint}
                disabled={cart.length === 0}
                className={`py-2.5 rounded-xl font-medium flex items-center justify-center gap-1 text-sm transition-colors ${
                  cart.length === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                  'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <Printer className="w-4 h-4" />인쇄
              </button>
              <button
                onClick={onBack}
                className="py-2.5 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium text-sm transition-colors"
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
  
  // 인라인 편집 state
  const [inlineEdit, setInlineEdit] = useState(null); // { id, field, value }
  const [customerInlineEdit, setCustomerInlineEdit] = useState(null); // { id, field, value }
  
  // 거래처 관련 state
  const [customerSearch, setCustomerSearch] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', memo: '' });
  const [deleteCustomerConfirm, setDeleteCustomerConfirm] = useState(null);

  // 인라인 편집 시작
  const startInlineEdit = (product, field) => {
    const value = field === 'wholesale' || field === 'retail' 
      ? (product[field] || '') 
      : product[field] || '';
    setInlineEdit({ id: product.id, field, value: String(value) });
  };

  // 인라인 편집 저장
  const saveInlineEdit = async () => {
    if (!inlineEdit) return;
    
    const { id, field, value } = inlineEdit;
    let updateData = {};
    
    if (field === 'wholesale' || field === 'retail') {
      const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      updateData[field] = numValue;
    } else {
      updateData[field] = value;
    }
    
    await onUpdateProduct(id, updateData);
    setInlineEdit(null);
  };

  // 인라인 편집 취소
  const cancelInlineEdit = () => {
    setInlineEdit(null);
  };

  // 인라인 편집 키 핸들러
  const handleInlineKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  // 거래처 인라인 편집 시작
  const startCustomerInlineEdit = (customer, field) => {
    setCustomerInlineEdit({ id: customer.id, field, value: customer[field] || '' });
  };

  // 거래처 인라인 편집 저장
  const saveCustomerInlineEdit = async () => {
    if (!customerInlineEdit) return;
    
    const { id, field, value } = customerInlineEdit;
    await onUpdateCustomer(id, { [field]: value });
    setCustomerInlineEdit(null);
  };

  // 거래처 인라인 편집 취소
  const cancelCustomerInlineEdit = () => {
    setCustomerInlineEdit(null);
  };

  // 거래처 인라인 편집 키 핸들러
  const handleCustomerInlineKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveCustomerInlineEdit();
    } else if (e.key === 'Escape') {
      cancelCustomerInlineEdit();
    }
  };

  // ESC 키로 뒤로가기 (모달이 열려있지 않을 때)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (inlineEdit) {
          setInlineEdit(null);
        } else if (customerInlineEdit) {
          setCustomerInlineEdit(null);
        } else if (showAddModal) {
          setShowAddModal(false);
        } else if (editingProduct) {
          setEditingProduct(null);
        } else if (showAddCustomerModal) {
          setShowAddCustomerModal(false);
        } else if (editingCustomer) {
          setEditingCustomer(null);
        } else if (showResetStockModal) {
          setShowResetStockModal(false);
        } else if (deleteConfirm) {
          setDeleteConfirm(null);
        } else if (deleteCustomerConfirm) {
          setDeleteCustomerConfirm(null);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, showAddModal, editingProduct, showAddCustomerModal, editingCustomer, showResetStockModal, deleteConfirm, deleteCustomerConfirm, inlineEdit, customerInlineEdit]);

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

  // 필터링된 거래처 (띄어쓰기 무시)
  const filteredCustomers = (customers || []).filter(c => {
    const search = customerSearch.toLowerCase().replace(/\s/g, '');
    const name = c.name.toLowerCase().replace(/\s/g, '');
    const address = (c.address || '').toLowerCase().replace(/\s/g, '');
    const phone = (c.phone || '').replace(/\s/g, '');
    return name.includes(search) || address.includes(search) || phone.includes(search);
  });

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
        // 특수문자 제거 및 띄어쓰기 제거
        const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');
        const productName = normalizeText(p.name);

        // 검색어를 단어별로 분리
        const searchWords = searchTerm.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

        // 모든 검색 단어가 제품명에 포함되어 있는지 확인 (순서 무관)
        const matchesSearch = searchWords.every(word => {
          const normalizedWord = normalizeText(word);
          return productName.includes(normalizedWord);
        });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <CustomStyles />
      
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 flex-shrink-0 select-none">
        <div className="w-full px-3 sm:px-4 py-2 sm:py-3">
          {/* 상단 행: 뒤로가기, 타이틀, 새로고침 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button onClick={onBack} className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                <h1 className="text-base sm:text-xl font-bold text-white">관리자</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button onClick={activeTab === 'products' ? onRefresh : onRefreshCustomers} disabled={isLoading} className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition-colors" title="새로고침">
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {activeTab === 'products' ? (
                <>
                  <button 
                    onClick={() => setShowResetStockModal(true)} 
                    className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    재고 초기화
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    제품추가
                  </button>
                </>
              ) : (
                <button onClick={() => setShowAddCustomerModal(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  거래처추가
                </button>
              )}
            </div>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              제품 관리 ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'customers' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              거래처 관리 ({(customers || []).length})
            </button>
          </div>
        </div>
        
        {/* 제품 탭 - 재고 현황 + 검색 (sticky) */}
        {activeTab === 'products' && (
          <div className="bg-slate-900/50 border-t border-slate-700/50 px-3 sm:px-4 py-3">
            {/* 재고 현황 카드 */}
            <div className="grid grid-cols-4 gap-2 mb-3 max-w-7xl mx-auto">
              <div onClick={() => setStockFilter('all')} className={`bg-slate-800 rounded-lg p-2 sm:p-3 cursor-pointer transition-all select-none ${stockFilter === 'all' ? 'ring-2 ring-blue-500' : 'hover:bg-slate-750'}`}>
                <p className="text-slate-400 text-[10px] sm:text-xs mb-0.5">전체 제품</p>
                <p className="text-lg sm:text-xl font-bold text-white">{stockStats.total}</p>
              </div>
              <div onClick={() => setStockFilter('normal')} className={`bg-slate-800 rounded-lg p-2 sm:p-3 cursor-pointer transition-all select-none ${stockFilter === 'normal' ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-750'}`}>
                <p className="text-slate-400 text-[10px] sm:text-xs mb-0.5">정상 재고</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-400">{stockStats.normalStock}</p>
              </div>
              <div onClick={() => setStockFilter('low')} className={`bg-slate-800 rounded-lg p-2 sm:p-3 cursor-pointer transition-all select-none ${stockFilter === 'low' ? 'ring-2 ring-yellow-500' : 'hover:bg-slate-750'}`}>
                <p className="text-slate-400 text-[10px] sm:text-xs mb-0.5">재고 부족</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">{stockStats.lowStock}</p>
              </div>
              <div onClick={() => setStockFilter('out')} className={`bg-slate-800 rounded-lg p-2 sm:p-3 cursor-pointer transition-all select-none ${stockFilter === 'out' ? 'ring-2 ring-red-500' : 'hover:bg-slate-750'}`}>
                <p className="text-slate-400 text-[10px] sm:text-xs mb-0.5">품절</p>
                <p className="text-lg sm:text-xl font-bold text-red-400">{stockStats.outOfStock}</p>
              </div>
            </div>
            
            {/* 검색 및 필터 */}
            <div className="flex flex-col md:flex-row gap-2 max-w-7xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="제품 검색..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        )}
        
        {/* 거래처 탭 - 검색 (sticky) */}
        {activeTab === 'customers' && (
          <div className="bg-slate-900/50 border-t border-slate-700/50 px-3 sm:px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="거래처 검색..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4">
          {activeTab === 'products' ? (
            <>
        {/* 제품 테이블 */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-700/50">
                <tr>
                  <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 whitespace-nowrap min-w-[150px]">
                    제품명 {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('category')} className="px-4 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 whitespace-nowrap min-w-[100px]">
                    카테고리 {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('wholesale')} className="px-4 py-3 text-right text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 whitespace-nowrap min-w-[90px]">
                    도매가 {sortField === 'wholesale' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300 whitespace-nowrap min-w-[90px]">소비자가</th>
                  <th onClick={() => handleSort('stock')} className="px-4 py-3 text-center text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 whitespace-nowrap min-w-[80px]">
                    재고 {sortField === 'stock' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300 whitespace-nowrap min-w-[60px]">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProducts.map(product => {
                  const stock = product.stock ?? 50;
                  const minStock = product.min_stock || 5;
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock <= minStock;
                  
                  return (
                    <tr key={product.id} className={`hover:bg-slate-700/30 transition-colors ${isOutOfStock ? 'bg-red-900/10' : isLowStock ? 'bg-yellow-900/10' : ''}`}>
                      {/* 제품명 - 인라인 편집 */}
                      <td className="px-4 py-3">
                        {inlineEdit?.id === product.id && inlineEdit?.field === 'name' ? (
                          <input
                            type="text"
                            value={inlineEdit.value}
                            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                            onKeyDown={handleInlineKeyDown}
                            onBlur={saveInlineEdit}
                            autoFocus
                            className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                          />
                        ) : (
                          <span 
                            onClick={() => startInlineEdit(product, 'name')}
                            className="text-white cursor-pointer hover:text-amber-400 hover:underline transition-colors"
                          >
                            {product.name}
                          </span>
                        )}
                      </td>
                      {/* 카테고리 - 인라인 편집 */}
                      <td className="px-4 py-3">
                        {inlineEdit?.id === product.id && inlineEdit?.field === 'category' ? (
                          <input
                            type="text"
                            value={inlineEdit.value}
                            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                            onKeyDown={handleInlineKeyDown}
                            onBlur={saveInlineEdit}
                            autoFocus
                            className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                          />
                        ) : (
                          <span 
                            onClick={() => startInlineEdit(product, 'category')}
                            className="text-slate-400 cursor-pointer hover:text-amber-400 hover:underline transition-colors"
                          >
                            {product.category}
                          </span>
                        )}
                      </td>
                      {/* 도매가 - 인라인 편집 */}
                      <td className="px-4 py-3 text-right">
                        {inlineEdit?.id === product.id && inlineEdit?.field === 'wholesale' ? (
                          <input
                            type="text"
                            value={inlineEdit.value}
                            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                            onKeyDown={handleInlineKeyDown}
                            onBlur={saveInlineEdit}
                            autoFocus
                            className="w-28 px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm text-right focus:outline-none"
                          />
                        ) : (
                          <span 
                            onClick={() => startInlineEdit(product, 'wholesale')}
                            className="text-emerald-400 cursor-pointer hover:text-amber-400 hover:underline transition-colors font-medium"
                          >
                            {formatPrice(product.wholesale)}
                          </span>
                        )}
                      </td>
                      {/* 소비자가 - 인라인 편집 */}
                      <td className="px-4 py-3 text-right">
                        {inlineEdit?.id === product.id && inlineEdit?.field === 'retail' ? (
                          <input
                            type="text"
                            value={inlineEdit.value}
                            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                            onKeyDown={handleInlineKeyDown}
                            onBlur={saveInlineEdit}
                            autoFocus
                            className="w-28 px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm text-right focus:outline-none"
                          />
                        ) : (
                          <span 
                            onClick={() => startInlineEdit(product, 'retail')}
                            className="text-blue-400 cursor-pointer hover:text-amber-400 hover:underline transition-colors font-medium"
                          >
                            {product.retail ? formatPrice(product.retail) : '-'}
                          </span>
                        )}
                      </td>
                      {/* 재고 - 고급스러운 디자인 */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setShowStockModal(product)}
                          className={`group relative min-w-[80px] px-4 py-1.5 text-sm font-semibold transition-all ${
                            isOutOfStock 
                              ? 'bg-gradient-to-r from-red-600/30 to-red-500/20 border border-red-500/50 text-red-400 hover:from-red-600/50 hover:to-red-500/40' 
                              : isLowStock 
                              ? 'bg-gradient-to-r from-yellow-600/30 to-amber-500/20 border border-yellow-500/50 text-yellow-400 hover:from-yellow-600/50 hover:to-amber-500/40'
                              : 'bg-gradient-to-r from-emerald-600/30 to-teal-500/20 border border-emerald-500/50 text-emerald-400 hover:from-emerald-600/50 hover:to-teal-500/40'
                          } rounded-lg`}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-1.5">
                            {isOutOfStock ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                                품절
                              </>
                            ) : (
                              <>
                                <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                                {stock}개
                              </>
                            )}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-slate-600 rounded-lg text-blue-400 transition-colors" title="전체 수정">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(product.id)} className="p-2 hover:bg-slate-600 rounded-lg text-red-400 transition-colors" title="삭제">
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
            {/* 거래처 목록 */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-700/50 border-b border-slate-600">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 whitespace-nowrap min-w-[120px]">업체명</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 whitespace-nowrap min-w-[120px]">연락처</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 whitespace-nowrap min-w-[180px]">주소</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300 whitespace-nowrap min-w-[100px]">메모</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-300 whitespace-nowrap min-w-[80px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                        {/* 업체명 - 인라인 편집 */}
                        <td className="px-4 py-3">
                          {customerInlineEdit?.id === customer.id && customerInlineEdit?.field === 'name' ? (
                            <input
                              type="text"
                              value={customerInlineEdit.value}
                              onChange={(e) => setCustomerInlineEdit({ ...customerInlineEdit, value: e.target.value })}
                              onKeyDown={handleCustomerInlineKeyDown}
                              onBlur={saveCustomerInlineEdit}
                              autoFocus
                              className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                            />
                          ) : (
                            <span 
                              onClick={() => startCustomerInlineEdit(customer, 'name')}
                              className="text-white font-medium cursor-pointer hover:text-amber-400 hover:underline transition-colors"
                            >
                              {customer.name}
                            </span>
                          )}
                        </td>
                        {/* 연락처 - 인라인 편집 */}
                        <td className="px-4 py-3">
                          {customerInlineEdit?.id === customer.id && customerInlineEdit?.field === 'phone' ? (
                            <input
                              type="text"
                              value={customerInlineEdit.value}
                              onChange={(e) => setCustomerInlineEdit({ ...customerInlineEdit, value: e.target.value })}
                              onKeyDown={handleCustomerInlineKeyDown}
                              onBlur={saveCustomerInlineEdit}
                              autoFocus
                              className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                            />
                          ) : (
                            <span 
                              onClick={() => startCustomerInlineEdit(customer, 'phone')}
                              className="text-slate-300 cursor-pointer hover:text-amber-400 hover:underline transition-colors"
                            >
                              {customer.phone || '-'}
                            </span>
                          )}
                        </td>
                        {/* 주소 - 인라인 편집 */}
                        <td className="px-4 py-3">
                          {customerInlineEdit?.id === customer.id && customerInlineEdit?.field === 'address' ? (
                            <input
                              type="text"
                              value={customerInlineEdit.value}
                              onChange={(e) => setCustomerInlineEdit({ ...customerInlineEdit, value: e.target.value })}
                              onKeyDown={handleCustomerInlineKeyDown}
                              onBlur={saveCustomerInlineEdit}
                              autoFocus
                              className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                            />
                          ) : (
                            <span 
                              onClick={() => startCustomerInlineEdit(customer, 'address')}
                              className="text-slate-400 text-sm cursor-pointer hover:text-amber-400 hover:underline transition-colors max-w-xs truncate block"
                            >
                              {customer.address || '-'}
                            </span>
                          )}
                        </td>
                        {/* 메모 - 인라인 편집 */}
                        <td className="px-4 py-3">
                          {customerInlineEdit?.id === customer.id && customerInlineEdit?.field === 'memo' ? (
                            <input
                              type="text"
                              value={customerInlineEdit.value}
                              onChange={(e) => setCustomerInlineEdit({ ...customerInlineEdit, value: e.target.value })}
                              onKeyDown={handleCustomerInlineKeyDown}
                              onBlur={saveCustomerInlineEdit}
                              autoFocus
                              className="w-full px-2 py-1 bg-slate-900 border border-amber-500 rounded text-white text-sm focus:outline-none"
                            />
                          ) : (
                            <span 
                              onClick={() => startCustomerInlineEdit(customer, 'memo')}
                              className="text-slate-500 text-sm cursor-pointer hover:text-amber-400 hover:underline transition-colors"
                            >
                              {customer.memo || '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingCustomer(customer)}
                              className="p-2 hover:bg-blue-600/20 rounded-lg text-blue-400 transition-colors"
                              title="전체 수정"
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
                                title="삭제"
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
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-8 border border-slate-700 shadow-2xl animate-scale-in">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-emerald-600/20 rounded-xl">
                      <Building className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">거래처 추가</h3>
                      <p className="text-slate-400">새 거래처 정보를 입력하세요</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">업체명 <span className="text-red-400">*</span></label>
                      <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="업체명" className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">연락처</label>
                      <input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="010-1234-5678" className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">주소</label>
                      <input type="text" value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="배송 주소" className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">메모</label>
                      <textarea value={newCustomer.memo} onChange={(e) => setNewCustomer({...newCustomer, memo: e.target.value})} placeholder="참고사항" rows={3} className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setShowAddCustomerModal(false)} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold text-lg transition-colors">취소</button>
                    <button onClick={handleAddCustomer} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-lg transition-colors">추가</button>
                  </div>
                </div>
              </div>
            )}

            {/* 거래처 수정 모달 */}
            {editingCustomer && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-8 border border-slate-700 shadow-2xl animate-scale-in">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-blue-600/20 rounded-xl">
                      <Edit3 className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">거래처 수정</h3>
                      <p className="text-slate-400">거래처 정보를 수정합니다</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">업체명 <span className="text-red-400">*</span></label>
                      <input type="text" value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">연락처</label>
                      <input type="text" value={editingCustomer.phone || ''} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">주소</label>
                      <input type="text" value={editingCustomer.address || ''} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">주소</label>
                      <input type="text" value={editingCustomer.address || ''} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">메모</label>
                      <textarea value={editingCustomer.memo || ''} onChange={(e) => setEditingCustomer({...editingCustomer, memo: e.target.value})} rows={3} className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setEditingCustomer(null)} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold text-lg transition-colors">취소</button>
                    <button onClick={handleUpdateCustomer} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-lg transition-colors">저장</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>

      {/* 제품 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-8 border border-slate-700 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-amber-600/20 rounded-xl">
                <Plus className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">제품 추가</h3>
                <p className="text-slate-400">새 제품을 등록합니다</p>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* 제품명 */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  제품명 <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                  placeholder="예: 레조 100 150 54" 
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                />
              </div>
              
              {/* 카테고리 */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  카테고리 <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text"
                  list="category-list"
                  value={newProduct.category} 
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
                  placeholder="선택 또는 새 카테고리 입력" 
                  className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                />
                <datalist id="category-list">
                  {categories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>
              
              {/* 가격 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    도매가 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.wholesale} 
                      onChange={(e) => setNewProduct({...newProduct, wholesale: e.target.value})} 
                      placeholder="0" 
                      className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">원</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    소비자가 <span className="text-slate-500 text-sm">(선택)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.retail} 
                      onChange={(e) => setNewProduct({...newProduct, retail: e.target.value})} 
                      placeholder="0" 
                      className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">원</span>
                  </div>
                </div>
              </div>
              
              {/* 재고 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    초기 재고
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.stock} 
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                      placeholder="50" 
                      className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">개</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    최소 재고 <span className="text-slate-500 text-sm">(알림)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={newProduct.min_stock} 
                      onChange={(e) => setNewProduct({...newProduct, min_stock: e.target.value})} 
                      placeholder="5" 
                      className="w-full px-5 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 pr-12" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">개</span>
                  </div>
                </div>
              </div>
              
              {/* 도움말 */}
              <div className="bg-slate-700/50 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400 text-sm">
                  <span className="text-red-400">*</span> 표시는 필수 입력 항목입니다. 
                  재고를 입력하지 않으면 기본값 50개로 설정됩니다.
                </p>
              </div>
            </div>
            
            {/* 버튼 */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => { setShowAddModal(false); setNewProduct({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' }); }} 
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold text-lg transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleAddProduct} 
                disabled={!newProduct.name || !newProduct.wholesale || !newProduct.category}
                className={`flex-1 py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-2">재고 수정</h3>
            <p className="text-slate-400 mb-4">{showStockModal.name}</p>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = Math.max(0, parseInt(input.value || 0) - 10); }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">-10</button>
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = Math.max(0, parseInt(input.value || 0) - 1); }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">-1</button>
              <input id="stock-input" type="number" defaultValue={showStockModal.stock || 0} className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center focus:outline-none focus:border-amber-500" />
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = parseInt(input.value || 0) + 1; }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">+1</button>
              <button onClick={() => { const input = document.getElementById('stock-input'); input.value = parseInt(input.value || 0) + 10; }} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">+10</button>
            </div>
            {/* 품절 버튼 */}
            <button 
              onClick={() => { document.getElementById('stock-input').value = 0; }} 
              className="w-full mb-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg text-red-400 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">🚫</span> 품절 처리 (재고 0)
            </button>
            <div className="flex gap-3">
              <button onClick={() => setShowStockModal(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">취소</button>
              <button onClick={() => { const newStock = document.getElementById('stock-input').value; handleQuickStock(showStockModal.id, newStock); setShowStockModal(null); }} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors">저장</button>
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
  const [dateFilter, setDateFilter] = useState('today'); // 기본값: 오늘
  const [customDate, setCustomDate] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showFilterDeleteConfirm, setShowFilterDeleteConfirm] = useState(false); // 필터 기준 전체 삭제
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false); // 상단 영역 접기/펼치기

  // ESC 키로 뒤로가기 (모달이 열려있지 않을 때)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteConfirm) {
          setDeleteConfirm(null);
        } else if (showBulkDeleteConfirm) {
          setShowBulkDeleteConfirm(false);
        } else if (showFilterDeleteConfirm) {
          setShowFilterDeleteConfirm(false);
        } else if (selectedOrders.length > 0) {
          setSelectedOrders([]);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, deleteConfirm, showBulkDeleteConfirm, showFilterDeleteConfirm, selectedOrders]);

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
    .filter(order => {
      const search = searchTerm.toLowerCase().replace(/\s/g, '');
      const orderNum = order.orderNumber.toLowerCase().replace(/\s/g, '');
      const customerName = (order.customerName || '').toLowerCase().replace(/\s/g, '');
      const customerPhone = (order.customerPhone || '').replace(/\s/g, '');
      return orderNum.includes(search) || customerName.includes(search) || customerPhone.includes(search);
    });

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
      {/* 헤더 */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 select-none">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="flex items-center gap-2">
                <List className="w-6 h-6 text-emerald-400" />
                <div>
                  <h1 className="text-lg font-bold text-white">주문 내역</h1>
                  <p className="text-emerald-400 text-xs">전체 {orders.length}건 · 필터 {filteredOrders.length}건</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedOrders.length > 0 && (
                <button
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className="text-sm px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1.5 font-medium transition-all hover-lift"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">삭제</span> ({selectedOrders.length})
                </button>
              )}
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {/* 접기/펼치기 버튼 */}
              <button
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-1.5 text-sm"
              >
                <span className="hidden sm:inline">{isHeaderCollapsed ? '펼치기' : '접기'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* 접힌 상태: 요약 정보 */}
          {isHeaderCollapsed && (
            <div className="mt-2 flex items-center justify-between text-xs bg-slate-700/30 rounded-lg px-3 py-2">
              <span className="text-slate-400">
                {getFilterLabel()} · {filteredOrders.length}건 · <span className="text-emerald-400 font-semibold">{formatPrice(filteredTotalSales)}</span>
              </span>
              {searchTerm && <span className="text-emerald-400">검색: {searchTerm}</span>}
            </div>
          )}
        </div>
        
        {/* 통계 + 필터 + 검색 영역 - 접기/펼치기 */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'}`}>
          <div className="px-4 pb-4 space-y-3">
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><FileText className="w-3 h-3" /> {dateFilter === 'all' ? '총 주문' : '조회 주문'}</p>
                <p className="text-white font-bold text-lg">{filteredOrders.length}건</p>
                {dateFilter !== 'all' && <p className="text-slate-500 text-[10px]">전체 {orders.length}건</p>}
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><Calculator className="w-3 h-3" /> {dateFilter === 'all' ? '총 매출' : '조회 매출'}</p>
                <p className="text-emerald-400 font-bold text-lg">{formatPrice(filteredTotalSales)}</p>
                {dateFilter !== 'all' && <p className="text-slate-500 text-[10px]">전체 {formatPrice(totalSales)}</p>}
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><Receipt className="w-3 h-3" /> 공급가액</p>
                <p className="text-blue-400 font-bold text-lg">{formatPrice(filteredTotalExVat)}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-slate-400 text-xs flex items-center gap-1"><Receipt className="w-3 h-3" /> 부가세</p>
                <p className="text-purple-400 font-bold text-lg">{formatPrice(filteredTotalSales - filteredTotalExVat)}</p>
              </div>
            </div>
            
            {/* 날짜 필터 */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: '오늘' },
                { key: 'yesterday', label: '어제' },
                { key: 'week', label: '이번 주' },
                { key: 'month', label: '이번 달' },
                { key: 'custom', label: '날짜 선택' },
                { key: 'all', label: '전체' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setDateFilter(key); setSelectedOrders([]); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dateFilter === key
                      ? 'bg-emerald-600 text-white'
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
                  className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
              <button
                onClick={() => setShowFilterDeleteConfirm(true)}
                disabled={filteredOrders.length === 0}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filteredOrders.length === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/40'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {getFilterLabel()} 삭제 ({filteredOrders.length})
              </button>
            </div>
            
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="주문번호, 고객명, 연락처 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            {/* 전체 선택 */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-slate-400 text-xs">전체 선택</span>
                <span className="text-slate-400 text-xs">
                  검색 결과: <span className="text-white font-semibold">{filteredOrders.length}건</span>
                  {selectedOrders.length > 0 && <span className="text-emerald-400 ml-1">({selectedOrders.length}개 선택)</span>}
                </span>
              </label>
              <span className="text-emerald-400 font-semibold text-sm">{formatPrice(filteredTotalSales)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 주문 목록 - 스크롤 영역 */}
      <div className="w-full px-4 py-4">
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
              <div key={order.orderNumber} className={`bg-slate-800/50 backdrop-blur rounded-xl border select-none ${selectedOrders.includes(order.orderNumber) ? 'border-emerald-500' : 'border-slate-700'} overflow-hidden card-glow hover-lift animate-fade-in-up`} style={{animationDelay: `${Math.min(index * 0.05, 0.3)}s`}}>
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
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [showStockOverview, setShowStockOverview] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showCustomerListModal, setShowCustomerListModal] = useState(false);
  const [showTextAnalyzeModal, setShowTextAnalyzeModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // 알림 설정 (localStorage에서 로드)
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      time: '09:00', // 알림 시간
      daysBeforeReminder: [0, 1], // 오늘(0), 내일(1) 알림
      includeOverdue: true, // 지연 건 포함
      dailyNotification: true // 매일 알림 vs 배송일 당일만
    };
  });

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

  // 앱 시작 시 Supabase에서 제품/거래처 데이터 불러오기
  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  // Lenis 부드러운 스크롤 초기화
  useEffect(() => {
    // 모바일 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // 모바일에서는 Lenis를 사용하지 않음 (네이티브 스크롤 사용)
    if (isMobile) {
      return;
    }
    
    const lenis = new Lenis({
      duration: 1.2,           // 스크롤 지속 시간 (높을수록 부드러움)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 물리 기반 이징
      orientation: 'vertical', // 수직 스크롤
      gestureOrientation: 'vertical',
      smoothWheel: true,       // 휠 스크롤 부드럽게
      smoothTouch: false,      // 터치 스크롤은 네이티브로
      wheelMultiplier: 1,      // 휠 속도
      touchMultiplier: 2,      // 터치 속도
      infinite: false,         // 무한 스크롤 끄기
      prevent: (node) => {
        // data-lenis-prevent 속성이 있는 요소 내부에서는 Lenis 비활성화
        // 모달, 드롭다운 등에서 사용
        return node.closest('[data-lenis-prevent]') !== null ||
               node.closest('.fixed.inset-0') !== null;
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

  // 관리자 로그인 모달 ESC 키 처리
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showAdminLogin) {
        setShowAdminLogin(false);
        setAdminPassword('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAdminLogin]);

  // 저장된 장바구니 불러오기 (Supabase)
  const loadSavedCartsFromDB = async () => {
    try {
      console.log('장바구니 불러오기 시도...');
      const data = await supabase.getSavedCarts();
      console.log('불러온 데이터:', data);

      // localStorage에서 예약 필드 불러오기
      const localExtras = JSON.parse(localStorage.getItem('cart_extras') || '{}');

      if (data) {
        // Supabase 데이터와 localStorage 데이터 병합
        const mergedData = data.map(cart => ({
          ...cart,
          ...(localExtras[cart.id] || {})
        }));
        setSavedCarts(mergedData);
        console.log('savedCarts 업데이트 완료:', mergedData.length, '개');
      }
    } catch (e) {
      console.error('저장된 장바구니 불러오기 실패:', e);
    }
  };

  useEffect(() => {
    loadSavedCartsFromDB();
  }, []);

  // 알림 설정 저장
  const saveNotificationSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    showToast('✅ 알림 설정이 저장되었습니다');
  };

  // 브라우저 알림 권한 요청 및 알림 표시
  useEffect(() => {
    // 알림이 비활성화되어 있으면 리턴
    if (!notificationSettings.enabled) return;

    // 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 저장된 장바구니가 로드된 후 알림 체크
    if (savedCarts.length === 0) return;

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 설정된 알림 시간 체크
    const [settingHour, settingMinute] = notificationSettings.time.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 시간이 맞지 않으면 리턴 (매일 알림인 경우)
    if (notificationSettings.dailyNotification) {
      // 정확한 시간이 아니면 리턴 (±5분 이내)
      if (Math.abs(currentHour - settingHour) > 0 || Math.abs(currentMinute - settingMinute) > 5) {
        return;
      }
    }

    // 배송일별로 분류
    const deliveriesByDay = {};
    const overdueDeliveries = [];

    savedCarts.forEach(cart => {
      if (!cart.delivery_date) return;

      const delivery = new Date(cart.delivery_date);
      delivery.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0 && notificationSettings.includeOverdue) {
        overdueDeliveries.push(cart);
      } else if (notificationSettings.daysBeforeReminder.includes(diffDays)) {
        if (!deliveriesByDay[diffDays]) deliveriesByDay[diffDays] = [];
        deliveriesByDay[diffDays].push(cart);
      }
    });

    // 알림 표시 여부 결정
    const hasNotifications = overdueDeliveries.length > 0 || Object.keys(deliveriesByDay).length > 0;
    if (!hasNotifications) return;

    // 알림 표시 (하루 한 번만 or 시간마다)
    const lastNotificationKey = notificationSettings.dailyNotification
      ? 'lastDeliveryNotification'
      : 'lastDeliveryNotificationTime';
    const lastNotification = localStorage.getItem(lastNotificationKey);
    const nowStr = notificationSettings.dailyNotification
      ? today.toISOString().split('T')[0]
      : now.toISOString();

    if (lastNotification === nowStr) return;

    if (Notification.permission === 'granted') {
      let body = '';
      if (overdueDeliveries.length > 0) body += `🔴 배송 지연: ${overdueDeliveries.length}건\n`;

      // 오늘/내일 배송 추가
      Object.keys(deliveriesByDay).forEach(diffDays => {
        const count = deliveriesByDay[diffDays].length;
        if (diffDays === '0') body += `⚡ 오늘 배송: ${count}건\n`;
        else if (diffDays === '1') body += `🟡 내일 배송: ${count}건\n`;
        else body += `📅 ${diffDays}일 후 배송: ${count}건\n`;
      });

      new Notification('📦 배송 알림', {
        body: body.trim(),
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'delivery-reminder',
        renotify: false
      });

      localStorage.setItem(lastNotificationKey, nowStr);
    }
  }, [savedCarts, notificationSettings]);

  // 장바구니 저장 (Supabase)
  const saveCartWithName = async (cartData) => {
    try {
      const now = new Date();
      const total = cart.reduce((sum, item) => {
        const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
        return sum + (price * item.quantity);
      }, 0);

      // 기존 string으로 전달된 경우 하위 호환성 유지
      const isLegacyFormat = typeof cartData === 'string';
      const name = isLegacyFormat ? cartData : cartData.name;
      const deliveryDate = isLegacyFormat ? null : cartData.deliveryDate;
      const status = isLegacyFormat ? 'scheduled' : cartData.status;
      const priority = isLegacyFormat ? 'normal' : cartData.priority;
      const memo = isLegacyFormat ? '' : cartData.memo;

      const newCart = {
        name,
        items: cart.map(item => ({ ...item })),
        total,
        price_type: priceType,
        date: now.toLocaleDateString('ko-KR'),
        time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        created_at: now.toISOString()
      };

      // 예약 관련 필드 추가 (항상 포함)
      if (!isLegacyFormat) {
        newCart.delivery_date = deliveryDate || null;
        newCart.status = status || 'scheduled';
        newCart.priority = priority || 'normal';
        newCart.memo = memo || '';
        newCart.reminded = false;
      }

      console.log('장바구니 저장 시도:', newCart);
      const result = await supabase.addSavedCart(newCart);
      console.log('저장 결과:', result);

      if (result && result[0]) {
        // Supabase에서 반환된 데이터에 예약 필드가 없을 수 있으므로 병합
        const savedCart = {
          ...newCart, // 로컬에서 준비한 전체 데이터
          ...result[0], // Supabase에서 반환된 데이터 (id 등)
          delivery_date: result[0].delivery_date || newCart.delivery_date,
          status: result[0].status || newCart.status,
          priority: result[0].priority || newCart.priority,
          memo: result[0].memo || newCart.memo,
          reminded: result[0].reminded !== undefined ? result[0].reminded : newCart.reminded
        };

        // localStorage에 예약 필드 저장
        if (result[0]._localOnly && result[0].id) {
          const localExtras = JSON.parse(localStorage.getItem('cart_extras') || '{}');
          localExtras[result[0].id] = {
            delivery_date: newCart.delivery_date,
            status: newCart.status,
            priority: newCart.priority,
            memo: newCart.memo,
            reminded: newCart.reminded
          };
          localStorage.setItem('cart_extras', JSON.stringify(localExtras));
          console.log('💾 예약 필드를 localStorage에 저장:', localExtras[result[0].id]);
        }

        setSavedCarts(prev => [savedCart, ...prev]);
        setCart([]); // 장바구니 초기화
        showToast(`💾 "${name}" 저장됨! (장바구니 초기화)`);
      } else {
        console.error('저장 실패 - result:', result);
        showToast('❌ 저장 실패', 'error');
      }
    } catch (error) {
      console.error('장바구니 저장 에러:', error);
      showToast('❌ 저장 실패: ' + error.message, 'error');
    }
  };

  // 저장된 장바구니 불러오기
  const loadSavedCart = (savedCart) => {
    const validItems = savedCart.items.filter(item =>
      products.some(p => p.id === item.id)
    ).map(item => {
      const currentProduct = products.find(p => p.id === item.id);
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
    setPriceType(savedCart.price_type || savedCart.priceType || 'wholesale');

    if (validItems.length < savedCart.items.length) {
      showToast(`📦 ${validItems.length}/${savedCart.items.length}개 제품 불러옴`);
    } else {
      showToast(`📦 "${savedCart.name}" 불러옴!`);
    }
  };

  // 저장된 장바구니 업데이트 (Supabase)
  const updateSavedCart = async (index, updatedCart) => {
    const cartToUpdate = savedCarts[index];
    if (cartToUpdate && cartToUpdate.id) {
      const result = await supabase.updateSavedCart(cartToUpdate.id, updatedCart);
      if (result && result[0]) {
        setSavedCarts(prev => {
          const newCarts = [...prev];
          newCarts[index] = result[0];
          return newCarts;
        });
        showToast('✅ 장바구니가 수정되었습니다');
        return true;
      } else {
        showToast('❌ 수정 실패', 'error');
        return false;
      }
    } else {
      // id가 없으면 로컬에서만 업데이트 (이전 데이터 호환)
      setSavedCarts(prev => {
        const newCarts = [...prev];
        newCarts[index] = { ...updatedCart };
        return newCarts;
      });
      showToast('✅ 장바구니가 수정되었습니다');
      return true;
    }
  };

  // 저장된 장바구니 삭제 (Supabase)
  const deleteSavedCart = async (index) => {
    const cartToDelete = savedCarts[index];
    if (cartToDelete && cartToDelete.id) {
      const success = await supabase.deleteSavedCart(cartToDelete.id);
      if (success) {
        setSavedCarts(prev => prev.filter((_, i) => i !== index));
        showToast('🗑️ 장바구니가 삭제되었습니다');
      } else {
        showToast('❌ 삭제 실패', 'error');
      }
    } else {
      // id가 없으면 로컬에서만 삭제 (이전 데이터 호환)
      setSavedCarts(prev => prev.filter((_, i) => i !== index));
      showToast('🗑️ 장바구니가 삭제되었습니다');
    }
  };

  // 저장된 장바구니 전체 삭제 (Supabase)
  const deleteSavedCartAll = async () => {
    const success = await supabase.deleteAllSavedCarts();
    if (success) {
      setSavedCarts([]);
      showToast('🗑️ 모든 장바구니가 삭제되었습니다');
    } else {
      showToast('❌ 삭제 실패', 'error');
    }
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
    // 비밀번호가 비어있으면 에러
    if (!adminPassword.trim()) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
      return;
    }
    
    if (adminPassword === ADMIN_PASSWORD) {
      setShowAdminLogin(false);
      setShowAccessGranted(true);
      
      // ACCESS GRANTED 애니메이션 후 페이지 이동
      setTimeout(() => {
        setIsAdminLoggedIn(true);
        setAdminPassword('');
        setCurrentPage('admin');
        loadProducts();
        setShowAccessGranted(false);
      }, 2000);
    } else {
      // 틀렸을 때 에러 애니메이션
      setLoginError(true);
      setAdminPassword('');
      setTimeout(() => setLoginError(false), 500);
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

  // Supabase에서 주문 업데이트
  const updateOrder = async (updatedOrder) => {
    setIsLoading(true);
    try {
      // Supabase 형식으로 변환
      const supabaseOrder = {
        customer_name: updatedOrder.customerName || null,
        customer_phone: updatedOrder.customerPhone || null,
        customer_address: updatedOrder.customerAddress || null,
        price_type: updatedOrder.priceType,
        items: updatedOrder.items,
        subtotal: Math.round(updatedOrder.totalAmount / 1.1),
        vat: updatedOrder.totalAmount - Math.round(updatedOrder.totalAmount / 1.1),
        total: updatedOrder.totalAmount,
        memo: updatedOrder.memo || null,
        updated_at: updatedOrder.updatedAt || new Date().toISOString()
      };

      const result = await supabase.updateOrder(updatedOrder.orderNumber, supabaseOrder);
      if (result) {
        // 주문 목록 업데이트
        setOrders(prev => prev.map(order =>
          order.orderNumber === updatedOrder.orderNumber ? updatedOrder : order
        ));
        setSelectedOrder(updatedOrder); // 모달에 표시된 주문도 업데이트
        setIsOnline(true);
        showToast('✅ 주문이 수정되었습니다');
        return true;
      } else {
        setIsOnline(false);
        showToast('❌ 수정에 실패했습니다', 'error');
        return false;
      }
    } catch (error) {
      console.error('수정 실패:', error);
      setIsOnline(false);
      showToast('❌ 수정에 실패했습니다', 'error');
      return false;
    } finally {
      setIsLoading(false);
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
      // 특수문자 제거 및 띄어쓰기 제거
      const normalizeText = (text) => text.toLowerCase().replace(/[\s\-_]/g, '');
      const productName = normalizeText(product.name);

      // 검색어를 단어별로 분리
      const searchWords = searchTerm.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 0);

      // 모든 검색 단어가 제품명에 포함되어 있는지 확인 (순서 무관)
      const matchesSearch = searchWords.every(word => {
        const normalizedWord = normalizeText(word);
        return productName.includes(normalizedWord);
      });

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
          onUpdateOrder={updateOrder}
          products={products.length > 0 ? products : priceData}
        />
      </>
    );
  }

  // 재고 현황 페이지
  if (showStockOverview) {
    return (
      <StockOverviewPage
        products={products.length > 0 ? products : priceData}
        categories={dynamicCategories}
        formatPrice={formatPrice}
        onBack={() => setShowStockOverview(false)}
      />
    );
  }

  // 거래처 목록 페이지
  if (showCustomerListModal) {
    return (
      <CustomerListPage
        customers={customers}
        orders={orders}
        formatPrice={formatPrice}
        onBack={() => setShowCustomerListModal(false)}
      />
    );
  }

  // 저장된 장바구니 페이지
  if (isSavedCartsModalOpen) {
    return (
      <SavedCartsPage
        savedCarts={savedCarts}
        onLoad={loadSavedCart}
        onDelete={deleteSavedCart}
        onDeleteAll={deleteSavedCartAll}
        onUpdate={updateSavedCart}
        products={products}
        formatPrice={formatPrice}
        onBack={() => setIsSavedCartsModalOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      
      {/* AI 주문 인식 모달 - 조건부 렌더링 */}
      {showTextAnalyzeModal && (
        <TextAnalyzePage
          products={products.length > 0 ? products : priceData}
          onAddToCart={(product, qty) => {
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
          onBack={() => setShowTextAnalyzeModal(false)}
        />
      )}

      {/* 알림 설정 모달 */}
      {showNotificationSettings && (
        <NotificationSettingsModal
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
          settings={notificationSettings}
          onSave={(newSettings) => {
            setNotificationSettings(newSettings);
            localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
            setShowNotificationSettings(false);
            showToast('✅ 알림 설정이 저장되었습니다');
          }}
        />
      )}

      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40 animate-fade-in-down">
        <div className="w-full px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 sm:py-3">
          <div className="flex items-center justify-between gap-1 xs:gap-2">
            {/* 로고 & 타이틀 */}
            <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0">
              <div className="w-7 h-7 xs:w-8 xs:h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-amber-400">POS 재고관리 시스템</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xs xs:text-sm font-bold text-amber-400">POS</h1>
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

            {/* 버튼들 - PC: 우측 정렬, 모바일: 스크롤 가능 */}
            <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 overflow-x-auto scrollbar-hide flex-1 sm:justify-end" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex-shrink-0 flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="관리자"
              >
                <Settings className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-amber-400" />
              </button>

              {/* 주문 이력 - 메인 버튼 */}
              <button
                onClick={() => { setCurrentPage('history'); loadOrders(); }}
                className="flex-shrink-0 flex items-center justify-center gap-0.5 xs:gap-1 p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="주문 이력"
              >
                <List className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-emerald-400" />
                {(() => {
                  const today = new Date();
                  const todayCount = orders.filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate.toDateString() === today.toDateString();
                  }).length;
                  return todayCount > 0 && (
                    <span className="min-w-3.5 xs:min-w-4 sm:min-w-5 h-3.5 xs:h-4 sm:h-5 px-0.5 xs:px-1 sm:px-1.5 bg-emerald-500 text-white text-[8px] xs:text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                      {todayCount > 99 ? '99+' : todayCount}
                    </span>
                  );
                })()}
              </button>

              {/* 저장된 장바구니 */}
              <button
                onClick={async () => { await loadSavedCartsFromDB(); setIsSavedCartsModalOpen(true); }}
                className="flex-shrink-0 flex items-center justify-center gap-0.5 xs:gap-1 p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 rounded-lg transition-all hover-lift btn-ripple relative"
                title="저장된 장바구니"
              >
                <ShoppingBag className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-violet-400" />
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);

                  const urgentCount = savedCarts.filter(cart => {
                    if (!cart.delivery_date) return false;
                    const delivery = new Date(cart.delivery_date);
                    delivery.setHours(0, 0, 0, 0);
                    return delivery <= tomorrow; // 오늘 또는 내일
                  }).length;

                  return urgentCount > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                      {urgentCount > 9 ? '9+' : urgentCount}
                    </span>
                  ) : savedCarts.length > 0 ? (
                    <span className="min-w-5 xs:min-w-5 sm:min-w-6 h-4 xs:h-5 sm:h-5 px-1 xs:px-1.5 sm:px-2 bg-violet-500 text-white text-[9px] xs:text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                      {savedCarts.length > 9 ? '9+' : savedCarts.length}
                    </span>
                  ) : null;
                })()}
              </button>

              {/* 알림 설정 버튼 */}
              <div className="flex-shrink-0 relative">
                <button
                  onClick={() => setShowNotificationSettings(true)}
                  className="flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg transition-all hover-lift btn-ripple"
                  title="알림 설정"
                >
                  <Bell className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-400" />
                </button>
                {(() => {
                  if (!notificationSettings.enabled) return null;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const notificationCount = savedCarts.filter(cart => {
                    if (!cart.delivery_date) return false;
                    const delivery = new Date(cart.delivery_date);
                    delivery.setHours(0, 0, 0, 0);

                    return notificationSettings.notifyDays.some(day => {
                      const targetDate = new Date(delivery);
                      targetDate.setDate(targetDate.getDate() + day);
                      return targetDate.getTime() === today.getTime();
                    });
                  }).length;

                  return notificationCount > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-slate-900">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  ) : null;
                })()}
              </div>

              {/* 구분선 */}
              <div className="hidden sm:block w-px h-6 bg-slate-600 mx-1"></div>

              {/* AI 주문 인식 버튼 - 노란색 */}
              <button
                onClick={() => setShowTextAnalyzeModal(true)}
                className="flex-shrink-0 flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-yellow-600/30 hover:bg-yellow-600/50 border border-yellow-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="AI 주문 인식"
              >
                <Sparkles className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </button>

              <button
                onClick={() => { loadCustomers(); setShowCustomerListModal(true); }}
                className="flex-shrink-0 flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="거래처 목록"
              >
                <Building className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>

              <button
                onClick={() => setShowStockOverview(true)}
                className="flex-shrink-0 flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="재고 현황"
              >
                <Package className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>

              <button
                onClick={() => { loadOrders(); setShowShippingModal(true); }}
                className="flex-shrink-0 flex items-center justify-center p-1.5 xs:p-2 sm:px-3 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/50 rounded-lg transition-all hover-lift btn-ripple"
                title="택배 송장"
              >
                <Truck className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 검색바 - 완전 고정 */}
      <div className="fixed top-[56px] xs:top-[64px] sm:top-[85px] left-2 xs:left-4 right-2 xs:right-4 md:right-[400px] lg:right-[420px] z-30">
        <div className="bg-gradient-to-r from-blue-900/95 to-blue-800/90 backdrop-blur-md rounded-xl p-3 border border-blue-600/50 shadow-lg shadow-blue-900/20">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="flex-[3] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="제품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full pl-9 pr-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 min-w-[100px] px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="전체">전체</option>
              {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            
            <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-slate-600">
              <button
                onClick={() => setPriceType('wholesale')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  priceType === 'wholesale' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                도매가
              </button>
              <button
                onClick={() => setPriceType('retail')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  priceType === 'retail' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                소비자가
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 pt-[125px] sm:pt-[145px] pb-48 md:pb-3 md:pr-[400px] lg:pr-[420px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 제품 목록 영역 */}
          <div className="flex-1">

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
                          className={`px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 hover-lift select-none ${
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

          {/* 장바구니 - 데스크톱에서만 오른쪽 상단 고정 (모바일에서는 숨김) */}
          <div className="hidden md:block fixed md:top-[85px] md:bottom-auto md:left-auto md:right-4 md:w-[380px] lg:w-[400px] z-40">
            <div className="bg-gradient-to-r from-emerald-900/95 to-teal-900/90 backdrop-blur-md md:rounded-xl md:border border-emerald-500/50 shadow-2xl shadow-emerald-900/30 md:shadow-lg animate-slide-in-right">
              <div className="px-3 py-2 border-b border-emerald-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-white">주문 목록</h2>
                  <span className="text-xs text-emerald-300 bg-emerald-800/50 px-2 py-0.5 rounded-full">{cart.length}종 / {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
                </div>
              </div>

              <div className="max-h-[calc(100vh-280px)] overflow-y-auto order-scroll" data-lenis-prevent="true" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-900/95 to-teal-900/90 backdrop-blur border-t-2 border-emerald-500/50 p-3 z-30 animate-fade-in-up" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-300/70 text-xs">공급가 {formatPrice(calcExVat(totalAmount))} + VAT</p>
            <p className="text-white text-xl font-bold">{formatPrice(totalAmount)}</p>
          </div>
          <button 
            onClick={() => {
              if (cart.length > 0) {
                setIsOrderModalOpen(true);
              } else {
                showToast('장바구니가 비어있습니다', 'error');
              }
            }} 
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

      {/* 관리자 로그인 모달 - 시크릿 테마 */}
      {showAdminLogin && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setShowAdminLogin(false); setAdminPassword(''); }
          }}
          tabIndex={-1}
        >
          {/* 배경 매트릭스 효과 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-red-500 text-xs font-mono"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animation: `matrix-rain ${2 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {Math.random() > 0.5 ? '01001' : '10110'}
              </div>
            ))}
          </div>
          
          {/* 모달 컨테이너 */}
          <div className={`relative max-w-md w-full ${loginError ? 'animate-shake-error' : ''}`}>
            {/* 스캔라인 효과 */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none secret-scanline" />
            
            {/* 메인 모달 */}
            <div 
              className={`relative bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-2xl p-8 border-2 shadow-2xl ${loginError ? 'animate-flash-red border-red-500' : 'border-red-500/50 animate-border-glow'}`}
              style={{
                boxShadow: loginError ? '0 0 60px rgba(255,0,64,0.8)' : '0 0 40px rgba(255,0,64,0.3), inset 0 0 60px rgba(0,0,0,0.5)'
              }}
            >
              {/* 코너 장식 */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-red-500 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-red-500 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-red-500 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-red-500 rounded-br-2xl" />
              
              {/* 헤더 */}
              <div className="text-center mb-8">
                {/* 아이콘 */}
                <div className="relative inline-block mb-4">
                  <div 
                    className={`w-20 h-20 rounded-full bg-gradient-to-br from-red-600/20 to-red-900/40 flex items-center justify-center border ${loginError ? 'border-red-500 animate-pulse' : 'border-red-500/50'}`}
                    style={{ boxShadow: loginError ? '0 0 50px rgba(255,0,64,0.8)' : '0 0 30px rgba(255,0,64,0.4)' }}
                  >
                    <Lock className={`w-10 h-10 text-red-500 ${loginError ? 'animate-pulse' : ''}`} />
                  </div>
                  {/* 회전하는 링 */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-500/50"
                    style={{ animation: 'unlock-spin 3s linear infinite' }}
                  />
                </div>
                
                {/* 타이틀 */}
                <h3 
                  className={`text-2xl font-bold mb-2 tracking-wider font-mono ${loginError ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                  style={{ textShadow: '0 0 10px rgba(255,0,64,0.8)' }}
                >
                  {loginError ? '[ ACCESS DENIED ]' : '[ RESTRICTED ACCESS ]'}
                </h3>
                <p className="text-slate-500 text-sm font-mono tracking-widest">
                  {loginError ? 'INVALID CREDENTIALS' : 'AUTHENTICATION REQUIRED'}
                </p>
                
                {/* 경고 텍스트 */}
                <div className={`mt-4 py-2 px-4 rounded-lg border inline-block ${loginError ? 'bg-red-600/30 border-red-500/50' : 'bg-red-900/20 border-red-500/30'}`}>
                  <p className={`text-xs font-mono ${loginError ? 'text-red-300 animate-pulse' : 'text-red-400 animate-pulse'}`}>
                    {loginError ? '⛔ AUTHENTICATION FAILED' : '⚠ UNAUTHORIZED ACCESS PROHIBITED'}
                  </p>
                </div>
              </div>
              
              {/* 입력 필드 */}
              <div className="relative mb-6">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm ${loginError ? 'text-red-400' : 'text-red-500'}`}>
                  {'>>'}
                </div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdminLogin();
                    if (e.key === 'Escape') { setShowAdminLogin(false); setAdminPassword(''); }
                  }}
                  placeholder={loginError ? "TRY AGAIN..." : "ENTER PASSCODE..."}
                  className={`w-full pl-12 pr-4 py-4 bg-black/50 border-2 rounded-xl text-red-400 font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:shadow-lg transition-all ${loginError ? 'border-red-500 bg-red-900/20' : 'border-red-500/30 focus:border-red-500'}`}
                  style={{ 
                    caretColor: '#ff0040',
                    textShadow: '0 0 5px rgba(255,0,64,0.5)'
                  }}
                  autoFocus
                />
                {/* 입력 필드 글로우 */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: adminPassword ? '0 0 20px rgba(255,0,64,0.3)' : 'none', transition: 'box-shadow 0.3s' }}
                />
              </div>
              
              {/* 버튼 */}
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }}
                  className="flex-1 py-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-400 hover:text-white font-mono tracking-wider transition-all duration-300 hover:border-slate-500"
                >
                  [ CANCEL ]
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl text-white font-bold font-mono tracking-wider transition-all duration-300 relative overflow-hidden group"
                  style={{ boxShadow: '0 0 20px rgba(255,0,64,0.4)' }}
                >
                  <span className="relative z-10">[ ACCESS ]</span>
                  {/* 버튼 스캔 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
              
              {/* 하단 장식 */}
              <div className="mt-6 pt-4 border-t border-red-500/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-600 text-xs font-mono">SECURE CONNECTION</span>
                </div>
                <span className="text-slate-700 text-xs font-mono">v2.0.25</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCESS GRANTED 애니메이션 */}
      {showAccessGranted && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
          {/* 배경 그리드 효과 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          
          {/* 스캔라인 효과 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)'
            }}
          />
          
          {/* 메인 콘텐츠 */}
          <div className="relative text-center">
            {/* 성공 아이콘 */}
            <div 
              className="mx-auto mb-8 w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center"
              style={{
                boxShadow: '0 0 60px rgba(0,255,0,0.5), inset 0 0 60px rgba(0,255,0,0.1)',
                animation: 'access-granted 0.5s ease-out forwards'
              }}
            >
              <Check 
                className="w-16 h-16 text-green-500" 
                style={{ 
                  filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.8))',
                  animation: 'access-granted 0.5s ease-out 0.2s forwards',
                  opacity: 0
                }} 
              />
            </div>
            
            {/* ACCESS GRANTED 텍스트 */}
            <div 
              className="font-mono text-5xl font-bold text-green-500 mb-4 tracking-widest"
              style={{
                textShadow: '0 0 20px rgba(0,255,0,0.8), 0 0 40px rgba(0,255,0,0.4)',
                animation: 'access-granted 0.5s ease-out 0.3s forwards',
                opacity: 0
              }}
            >
              ACCESS GRANTED
            </div>
            
            {/* 서브 텍스트 */}
            <div 
              className="font-mono text-green-400/70 tracking-wider mb-8"
              style={{
                animation: 'access-granted 0.5s ease-out 0.5s forwards',
                opacity: 0
              }}
            >
              WELCOME, ADMINISTRATOR
            </div>
            
            {/* 로딩 바 */}
            <div className="w-64 h-1 bg-green-900/50 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                style={{
                  animation: 'loading-bar 1.5s ease-out forwards',
                  width: '0%'
                }}
              />
            </div>
            
            {/* 시스템 메시지 */}
            <div 
              className="mt-6 font-mono text-xs text-green-500/50 space-y-1"
              style={{
                animation: 'access-granted 0.5s ease-out 0.7s forwards',
                opacity: 0
              }}
            >
              <p>INITIALIZING ADMIN INTERFACE...</p>
              <p>LOADING SECURE MODULES...</p>
            </div>
          </div>
          
          {/* 코너 장식 */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-green-500/50" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-green-500/50" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-green-500/50" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-green-500/50" />
          
          {/* 하단 시스템 정보 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-green-500/30 flex items-center gap-4">
            <span>SYS.AUTH.v2.0</span>
            <span className="w-1 h-1 rounded-full bg-green-500/50" />
            <span>ENCRYPTION: AES-256</span>
            <span className="w-1 h-1 rounded-full bg-green-500/50" />
            <span>STATUS: AUTHENTICATED</span>
          </div>
        </div>
      )}

      {/* 주문서 모달 */}
      {isOrderModalOpen && (
        <OrderPage
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
          onBack={() => setIsOrderModalOpen(false)}
        />
      )}

      {/* 장바구니 저장 모달 */}
      <SaveCartModal
        isOpen={isSaveCartModalOpen}
        onSave={saveCartWithName}
        cart={cart}
        priceType={priceType}
        formatPrice={formatPrice}
        customerName={saveCartCustomerName}
        onBack={() => setIsSaveCartModalOpen(false)}
        onCloseAll={() => { 
          setIsSaveCartModalOpen(false); 
          setIsOrderModalOpen(false); 
        }}
      />

      {/* 택배 송장 모달 - createPortal로 body에 직접 렌더링 */}
      {showShippingModal && createPortal(
        <ShippingLabelPage
          orders={orders}
          customers={customers}
          formatPrice={formatPrice}
          onBack={() => setShowShippingModal(false)}
          refreshCustomers={loadCustomers}
        />,
        document.body
      )}
    </div>
  );
}
