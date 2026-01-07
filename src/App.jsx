import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, ShoppingCart, Package, Calculator, Trash2, Plus, Minus, X, ChevronDown, ChevronUp, FileText, Copy, Check, History, Save, Eye, Calendar, Clock, ChevronLeft, Cloud, RefreshCw, Users, Receipt, Wifi, WifiOff, Settings, Lock, Upload, Download, Edit3, LogOut, Zap } from 'lucide-react';

// ==================== 물리 기반 부드러운 스크롤 훅 ====================
const useSmoothScroll = () => {
  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId = null;
    const ease = 0.08; // 부드러움 정도 (낮을수록 부드러움)
    const threshold = 0.5;
    
    const smoothScroll = () => {
      const diff = targetY - currentY;
      
      if (Math.abs(diff) > threshold) {
        currentY += diff * ease;
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = null;
      }
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      // 스크롤 속도 조절
      const delta = e.deltaY * 0.8;
      targetY = Math.max(0, Math.min(targetY + delta, document.body.scrollHeight - window.innerHeight));
      
      if (!rafId) {
        rafId = requestAnimationFrame(smoothScroll);
      }
    };
    
    // 터치 디바이스가 아닐 때만 적용
    const isTouchDevice = 'ontouchstart' in window;
    
    if (!isTouchDevice) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (!isTouchDevice) {
        window.removeEventListener('wheel', handleWheel);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
};

// ==================== SUPABASE 설정 ====================
const SUPABASE_URL = 'https://icqxomltplewrhopafpq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YB9UnUwuMql8hUGHgC0bsg_DhrAxpji';

// 관리자 비밀번호 (원하는 비밀번호로 변경하세요)
const ADMIN_PASSWORD = '1234';

// Supabase API 호출 함수
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
  }
};

// ==================== 커스텀 스타일 ====================
const CustomStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
    .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
    .animate-pulse-custom { animation: pulse 2s infinite; }
    .animate-bounce-custom { animation: bounce 1s infinite; }
    
    /* Smooth momentum scrolling - 물리 기반 스크롤 */
    * {
      scroll-behavior: smooth;
    }
    html, body {
      overscroll-behavior: none;
    }
    .smooth-scroll,
    .order-scroll,
    .overflow-y-auto {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      overscroll-behavior-y: contain;
    }
    
    /* Hide number input spinners */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    
    .hover-lift {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    
    .btn-ripple {
      position: relative;
      overflow: hidden;
    }
    .btn-ripple:active::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      animation: ripple 0.6s ease-out;
    }
    @keyframes ripple {
      from { transform: scale(0); opacity: 1; }
      to { transform: scale(2.5); opacity: 0; }
    }
    
    .product-card {
      transition: all 0.2s ease;
    }
    .product-card:hover {
      background: rgba(255,255,255,0.08);
      transform: scale(1.02);
    }
    .product-card:active {
      transform: scale(0.98);
    }
    
    /* 고급 스크롤바 디자인 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #10b981 0%, #0d9488 50%, #059669 100%);
      border-radius: 10px;
      border: 2px solid rgba(30, 41, 59, 0.3);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #34d399 0%, #2dd4bf 50%, #10b981 100%);
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    
    .order-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .order-scroll::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
    }
    .order-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #10b981, #059669);
      border-radius: 10px;
    }
    .order-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #34d399, #10b981);
    }
    
    /* 스크롤 시 요소 애니메이션 */
    @keyframes scrollReveal {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .scroll-reveal {
      animation: scrollReveal 0.4s ease-out forwards;
    }
    
    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { 
        position: absolute; 
        left: 0; 
        top: 0; 
        width: 100%;
        padding: 20px;
      }
    }
  `}</style>
);

// ==================== 가격 포맷 함수 ====================
const formatPrice = (price) => {
  if (price === null || price === undefined) return '-';
  return price.toLocaleString('ko-KR') + '원';
};

const formatPriceShort = (price) => {
  if (price === null || price === undefined) return '-';
  if (price >= 10000) {
    return (price / 10000).toFixed(price % 10000 === 0 ? 0 : 1) + '만';
  }
  return price.toLocaleString('ko-KR');
};

// ==================== 저장된 장바구니 모달 ====================
function SavedCartsModal({ isOpen, onClose, savedCarts, onLoad, onDelete, formatPrice }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl border border-slate-700">
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
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
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
function SaveCartModal({ isOpen, onClose, onSave, cart, priceType, formatPrice }) {
  const [cartName, setCartName] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // 기본 이름 생성 (날짜 + 시간)
      const now = new Date();
      const defaultName = `장바구니 ${now.toLocaleDateString('ko-KR')} ${now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
      setCartName(defaultName);
    }
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
      <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700">
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
              placeholder="예: 단골A 주문, 정기 주문 등"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              autoFocus
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

// ==================== 주문서 모달 ====================
function OrderModal({ isOpen, onClose, cart, priceType, formatPrice, onSave, isSaving, products }) {
  const [customerName, setCustomerName] = useState('');
  const [memo, setMemo] = useState('');
  const [editableItems, setEditableItems] = useState([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setEditableItems(cart.map(item => ({
        ...item,
        editedPrice: priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale)
      })));
      setSearchTerm('');
      setShowProductSearch(false);
    }
  }, [isOpen, cart, priceType]);
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // 단가 수정
  const updateItemPrice = (id, newPrice) => {
    setEditableItems(items => 
      items.map(item => 
        item.id === id ? { ...item, editedPrice: parseInt(newPrice) || 0 } : item
      )
    );
  };
  
  // 수량 수정
  const updateItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setEditableItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // 제품 삭제
  const removeItem = (id) => {
    setEditableItems(items => items.filter(item => item.id !== id));
  };
  
  // 제품 추가
  const addProduct = (product) => {
    const existing = editableItems.find(item => item.id === product.id);
    if (existing) {
      updateItemQuantity(product.id, existing.quantity + 1);
    } else {
      const price = priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
      setEditableItems([...editableItems, { ...product, quantity: 1, editedPrice: price }]);
    }
    setSearchTerm('');
    setShowProductSearch(false);
  };
  
  // 검색된 제품 필터링 (띄어쓰기 무시)
  const filteredProducts = products.filter(p => {
    const normalizedName = p.name.toLowerCase().replace(/\s/g, '');
    const normalizedCategory = p.category.toLowerCase().replace(/\s/g, '');
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s/g, '');
    return normalizedName.includes(normalizedSearch) || normalizedCategory.includes(normalizedSearch);
  }).slice(0, 10);
  
  const total = editableItems.reduce((sum, item) => sum + (item.editedPrice * item.quantity), 0);
  const totalVATExcluded = Math.round(total / 1.1);
  
  const generateOrderText = () => {
    const date = new Date().toLocaleDateString('ko-KR');
    let text = `📋 주문서\n`;
    text += `━━━━━━━━━━━━━━━\n`;
    if (customerName) text += `고객명: ${customerName}\n`;
    text += `날짜: ${date}\n`;
    text += `━━━━━━━━━━━━━━━\n\n`;
    
    editableItems.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name}\n`;
      text += `   ${formatPrice(item.editedPrice)} × ${item.quantity}개 = ${formatPrice(item.editedPrice * item.quantity)}\n`;
    });
    
    text += `\n━━━━━━━━━━━━━━━\n`;
    text += `합계: ${formatPrice(total)}\n`;
    text += `(VAT 제외: ${formatPrice(totalVATExcluded)})\n`;
    if (memo) text += `\n메모: ${memo}\n`;
    
    return text;
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };
  
  const handleSave = async () => {
    const orderData = {
      customerName,
      memo,
      items: editableItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.editedPrice,
        quantity: item.quantity
      })),
      total,
      priceType
    };
    
    await onSave(orderData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">주문서</h2>
            <span className="text-emerald-200 text-sm">({editableItems.length}종 {editableItems.reduce((s, i) => s + i.quantity, 0)}개)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] print-area">
          {/* 고객명 */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-1">고객명</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="고객명 입력 (선택)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          {/* 제품 추가 검색 */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-1">제품 추가</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowProductSearch(true); }}
                onFocus={() => setShowProductSearch(true)}
                placeholder="제품명 검색하여 추가..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {showProductSearch && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="p-3 text-slate-400 text-sm text-center">검색 결과 없음</div>
                  ) : (
                    filteredProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="px-4 py-2 hover:bg-slate-600 cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-slate-400 text-xs">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className={`${priceType === 'wholesale' ? 'text-emerald-400' : 'text-red-400'} text-sm font-semibold`}>
                            {formatPrice(priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale))}
                          </p>
                          <p className="text-slate-500 text-xs">{priceType === 'wholesale' ? '도매가' : '소비자가'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 주문 목록 */}
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            {editableItems.length === 0 ? (
              <div className="text-center py-4">
                <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">주문 목록이 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-2">
                {editableItems.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-white text-sm font-medium flex-1">{item.name}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* 단가 */}
                      <div className="flex-1">
                        <label className="text-slate-500 text-xs">단가</label>
                        <p className="text-white text-sm py-1">{formatPrice(item.editedPrice)}</p>
                      </div>
                      {/* 수량 */}
                      <div>
                        <label className="text-slate-500 text-xs">수량</label>
                        <div className="flex items-center bg-slate-700 rounded">
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded-l text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 bg-transparent text-center text-white text-sm focus:outline-none"
                          />
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded-r text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {/* 금액 */}
                      <div className="text-right">
                        <label className="text-slate-500 text-xs">금액</label>
                        <p className={`${priceType === 'wholesale' ? 'text-emerald-400' : 'text-red-400'} font-bold`}>{formatPrice(item.editedPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 합계 */}
          <div className={`${priceType === 'wholesale' ? 'bg-emerald-900/30' : 'bg-red-900/30'} rounded-xl p-4 mb-4`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">합계 <span className="text-xs">({priceType === 'wholesale' ? '도매가' : '소비자가'})</span></span>
              <span className={`text-2xl font-bold ${priceType === 'wholesale' ? 'text-emerald-400' : 'text-red-400'}`}>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">VAT 제외</span>
              <span className="text-slate-400">{formatPrice(totalVATExcluded)}</span>
            </div>
          </div>
          
          {/* 메모 */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-1">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모 입력 (선택)"
              rows={2}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>
        
        <div className="bg-slate-900 px-6 py-4 flex gap-3 flex-wrap">
          <button
            onClick={handleSave}
            disabled={isSaving || editableItems.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Cloud className="w-5 h-5" />
            )}
            {isSaving ? '저장 중...' : '클라우드 저장'}
          </button>
          <button
            onClick={copyToClipboard}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? '복사됨!' : '복사'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 주문 상세 모달 ====================
function OrderDetailModal({ isOpen, onClose, order, formatPrice }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !order) return null;
  
  const generateOrderText = () => {
    let text = `📋 주문서\n`;
    text += `━━━━━━━━━━━━━━━\n`;
    text += `주문번호: ${order.orderNumber}\n`;
    if (order.customerName) text += `고객명: ${order.customerName}\n`;
    text += `날짜: ${order.date} ${order.time}\n`;
    text += `━━━━━━━━━━━━━━━\n\n`;
    
    order.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name}\n`;
      text += `   ${formatPrice(item.price)} × ${item.quantity}개 = ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    text += `\n━━━━━━━━━━━━━━━\n`;
    text += `합계: ${formatPrice(order.total)}\n`;
    text += `(VAT 제외: ${formatPrice(Math.round(order.total / 1.1))})\n`;
    if (order.memo) text += `\n메모: ${order.memo}\n`;
    
    return text;
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">주문 상세</h2>
            <p className="text-blue-200 text-sm">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              {order.date}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              {order.time}
            </div>
          </div>
          
          {order.customerName && (
            <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400 text-sm">고객명: </span>
              <span className="text-white">{order.customerName}</span>
            </div>
          )}
          
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-slate-500 text-xs">{formatPrice(item.price)} × {item.quantity}</p>
                </div>
                <p className="text-emerald-400 font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-emerald-900/30 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">합계</span>
              <span className="text-xl font-bold text-emerald-400">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">VAT 제외</span>
              <span className="text-slate-400">{formatPrice(Math.round(order.total / 1.1))}</span>
            </div>
          </div>
          
          {order.memo && (
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400 text-sm">메모: </span>
              <span className="text-white text-sm">{order.memo}</span>
            </div>
          )}
        </div>
        
        <div className="bg-slate-900 px-6 py-4 flex gap-3">
          <button
            onClick={copyToClipboard}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? '복사됨!' : '복사'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 관리자 페이지 ====================
function AdminPage({ onBack, formatPrice, onProductsUpdate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' });
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('전체');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out
  const [showStockModal, setShowStockModal] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await supabase.getProducts();
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('제품 불러오기 실패:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setPassword('');
    } else {
      showAlert('비밀번호가 틀렸습니다.', 'error');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.wholesale || !newProduct.category) {
      showAlert('제품명, 도매가, 카테고리는 필수입니다.', 'error');
      return;
    }

    const productData = {
      name: newProduct.name,
      wholesale: parseInt(newProduct.wholesale),
      retail: newProduct.retail ? parseInt(newProduct.retail) : null,
      category: newProduct.category,
      stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
      min_stock: newProduct.min_stock ? parseInt(newProduct.min_stock) : 5
    };

    const result = await supabase.addProduct(productData);
    if (result) {
      showAlert('제품이 추가되었습니다.');
      setNewProduct({ name: '', wholesale: '', retail: '', category: '', stock: '', min_stock: '5' });
      setShowAddForm(false);
      loadProducts();
      onProductsUpdate();
    } else {
      showAlert('제품 추가에 실패했습니다.', 'error');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const productData = {
      name: editingProduct.name,
      wholesale: parseInt(editingProduct.wholesale),
      retail: editingProduct.retail ? parseInt(editingProduct.retail) : null,
      category: editingProduct.category,
      stock: editingProduct.stock !== undefined ? parseInt(editingProduct.stock) : 0,
      min_stock: editingProduct.min_stock !== undefined ? parseInt(editingProduct.min_stock) : 5
    };

    const result = await supabase.updateProduct(editingProduct.id, productData);
    if (result) {
      showAlert('제품이 수정되었습니다.');
      setEditingProduct(null);
      loadProducts();
      onProductsUpdate();
    } else {
      showAlert('제품 수정에 실패했습니다.', 'error');
    }
  };

  // 재고만 빠르게 수정
  const handleQuickStockUpdate = async (product, newStock) => {
    const productData = {
      ...product,
      stock: parseInt(newStock) || 0
    };
    const result = await supabase.updateProduct(product.id, productData);
    if (result) {
      showAlert(`${product.name} 재고가 ${newStock}개로 수정되었습니다.`);
      setShowStockModal(null);
      loadProducts();
      onProductsUpdate();
    } else {
      showAlert('재고 수정에 실패했습니다.', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    const result = await supabase.deleteProduct(id);
    if (result) {
      showAlert('제품이 삭제되었습니다.');
      setDeleteConfirm(null);
      loadProducts();
      onProductsUpdate();
    } else {
      showAlert('제품 삭제에 실패했습니다.', 'error');
    }
  };

  const exportCSV = () => {
    const BOM = '\uFEFF';
    let csv = BOM + '제품명,도매가,소비자가,카테고리\n';
    products.forEach(p => {
      csv += `"${p.name}",${p.wholesale},${p.retail || ''},${p.category}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('CSV 파일이 다운로드되었습니다.');
  };

  const importCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const header = lines[0].toLowerCase();
        
        if (!header.includes('제품명') && !header.includes('name')) {
          showAlert('올바른 CSV 형식이 아닙니다.', 'error');
          return;
        }

        const newProducts = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          if (values[0] && values[1]) {
            newProducts.push({
              name: values[0],
              wholesale: parseInt(values[1]) || 0,
              retail: values[2] ? parseInt(values[2]) : null,
              category: values[3] || '기타'
            });
          }
        }

        if (newProducts.length === 0) {
          showAlert('가져올 제품이 없습니다.', 'error');
          return;
        }

        if (confirm(`${newProducts.length}개의 제품을 가져오시겠습니까?`)) {
          let successCount = 0;
          for (const product of newProducts) {
            const result = await supabase.addProduct(product);
            if (result) successCount++;
          }
          showAlert(`${successCount}개의 제품이 추가되었습니다.`);
          loadProducts();
          onProductsUpdate();
        }
      } catch (error) {
        showAlert('CSV 파일 처리 중 오류가 발생했습니다.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const categories = [...new Set(products.map(p => p.category))].sort();

  // 정렬 토글 함수
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 재고 현황 통계
  const stockStats = useMemo(() => {
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.min_stock || 5)).length;
    const normalStock = products.filter(p => (p.stock || 0) > (p.min_stock || 5)).length;
    return { outOfStock, lowStock, normalStock };
  }, [products]);

  const filteredProducts = products
    .filter(p => {
      const normalizedName = p.name.toLowerCase().replace(/\s/g, '');
      const normalizedCategory = p.category.toLowerCase().replace(/\s/g, '');
      const normalizedSearch = searchTerm.toLowerCase().replace(/\s/g, '');
      const matchesSearch = normalizedName.includes(normalizedSearch) || normalizedCategory.includes(normalizedSearch);
      const matchesCategory = filterCategory === '전체' || p.category === filterCategory;
      
      // 재고 필터
      let matchesStock = true;
      const stock = p.stock || 0;
      const minStock = p.min_stock || 5;
      if (stockFilter === 'out') {
        matchesStock = stock === 0;
      } else if (stockFilter === 'low') {
        matchesStock = stock > 0 && stock <= minStock;
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
        case 'retail':
          comparison = (a.retail || 0) - (b.retail || 0);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category, 'ko');
          break;
        case 'stock':
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
            <p className="text-slate-400 mt-2">비밀번호를 입력하세요</p>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 mb-4"
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-500 transition-colors mb-4"
          >
            로그인
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
          >
            돌아가기
          </button>
        </div>

        {alert && (
          <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
            alert.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          } text-white font-medium animate-fade-in`}>
            {alert.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="w-full px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-bold text-white">제품 관리</h1>
              <span className="text-sm text-slate-400">({products.length}개)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={loadProducts} disabled={isLoading} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-4 lg:px-6">
        {/* 재고 현황 대시보드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div 
            onClick={() => setStockFilter('all')}
            className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'all' ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-750'}`}
          >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">전체 제품</span>
            </div>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
          <div 
            onClick={() => setStockFilter('all')}
            className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-750`}
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">정상 재고</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stockStats.normalStock}</p>
          </div>
          <div 
            onClick={() => setStockFilter('low')}
            className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'low' ? 'ring-2 ring-yellow-500' : 'hover:bg-slate-750'}`}
          >
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">재고 부족</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{stockStats.lowStock}</p>
          </div>
          <div 
            onClick={() => setStockFilter('out')}
            className={`bg-slate-800 rounded-xl p-4 cursor-pointer transition-all ${stockFilter === 'out' ? 'ring-2 ring-red-500' : 'hover:bg-slate-750'}`}
          >
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">품절</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{stockStats.outOfStock}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="제품명 또는 카테고리 검색..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">제품 추가</span>
                </button>
                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">CSV 내보내기</span>
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span className="hidden sm:inline">CSV 가져오기</span>
                  <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
                </label>
              </div>
              
              {/* 카테고리 드롭다운 */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 min-w-[180px]"
              >
                <option value="전체">전체 ({products.length}개)</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat} ({products.filter(p => p.category === cat).length})</option>
                ))}
              </select>
            </div>

          {showAddForm && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg animate-fade-in">
              <h3 className="text-white font-semibold mb-3">새 제품 추가</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="제품명 *" className="col-span-2 bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500" />
                <input type="number" value={newProduct.wholesale} onChange={(e) => setNewProduct({ ...newProduct, wholesale: e.target.value })} placeholder="도매가 *" className="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500" />
                <input type="number" value={newProduct.retail} onChange={(e) => setNewProduct({ ...newProduct, retail: e.target.value })} placeholder="소비자가" className="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500" />
                <input type="text" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} placeholder="카테고리 *" list="category-list" className="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500" />
                <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="재고 수량" className="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500" />
                <datalist id="category-list">{categories.map(cat => <option key={cat} value={cat} />)}</datalist>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleAddProduct} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">추가</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">취소</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
              <p className="text-slate-400">로딩 중...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">제품이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className="text-left px-4 py-3 text-slate-300 font-medium cursor-pointer hover:bg-slate-600 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2">
                        제품명
                        <span className={`text-xs ${sortField === 'name' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('wholesale')}
                      className="text-right px-4 py-3 text-slate-300 font-medium w-32 cursor-pointer hover:bg-slate-600 transition-colors select-none"
                    >
                      <div className="flex items-center justify-end gap-2">
                        도매가
                        <span className={`text-xs ${sortField === 'wholesale' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {sortField === 'wholesale' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('retail')}
                      className="text-right px-4 py-3 text-slate-300 font-medium w-32 cursor-pointer hover:bg-slate-600 transition-colors select-none"
                    >
                      <div className="flex items-center justify-end gap-2">
                        소비자가
                        <span className={`text-xs ${sortField === 'retail' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {sortField === 'retail' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className="text-left px-4 py-3 text-slate-300 font-medium w-40 cursor-pointer hover:bg-slate-600 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2">
                        카테고리
                        <span className={`text-xs ${sortField === 'category' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {sortField === 'category' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('stock')}
                      className="text-center px-4 py-3 text-slate-300 font-medium w-28 cursor-pointer hover:bg-slate-600 transition-colors select-none"
                    >
                      <div className="flex items-center justify-center gap-2">
                        재고
                        <span className={`text-xs ${sortField === 'stock' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {sortField === 'stock' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="text-center px-4 py-3 text-slate-300 font-medium w-24">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stock = product.stock || 0;
                    const minStock = product.min_stock || 5;
                    const isOutOfStock = stock === 0;
                    const isLowStock = stock > 0 && stock <= minStock;
                    
                    return (
                    <tr key={product.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      {editingProduct?.id === product.id ? (
                        <>
                          <td className="px-4 py-2"><input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white focus:outline-none focus:border-amber-500" /></td>
                          <td className="px-4 py-2"><input type="number" value={editingProduct.wholesale} onChange={(e) => setEditingProduct({ ...editingProduct, wholesale: e.target.value })} className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-amber-500" /></td>
                          <td className="px-4 py-2"><input type="number" value={editingProduct.retail || ''} onChange={(e) => setEditingProduct({ ...editingProduct, retail: e.target.value })} className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-amber-500" /></td>
                          <td className="px-4 py-2"><input type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} list="edit-category-list" className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white focus:outline-none focus:border-amber-500" /><datalist id="edit-category-list">{categories.map(cat => <option key={cat} value={cat} />)}</datalist></td>
                          <td className="px-4 py-2"><input type="number" value={editingProduct.stock || 0} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-amber-500" /></td>
                          <td className="px-4 py-2"><div className="flex items-center justify-center gap-1"><button onClick={handleUpdateProduct} className="p-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white"><Check className="w-4 h-4" /></button><button onClick={() => setEditingProduct(null)} className="p-1 bg-slate-600 hover:bg-slate-500 rounded text-white"><X className="w-4 h-4" /></button></div></td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-white">{product.name}</td>
                          <td className="px-4 py-3 text-emerald-400 text-right">{formatPrice(product.wholesale)}</td>
                          <td className="px-4 py-3 text-blue-400 text-right">{product.retail ? formatPrice(product.retail) : '-'}</td>
                          <td className="px-4 py-3 text-slate-400">{product.category}</td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => setShowStockModal(product)}
                              className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
                                isOutOfStock 
                                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                                  : isLowStock 
                                    ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                              }`}
                            >
                              {isOutOfStock ? '품절' : `${stock}개`}
                            </button>
                          </td>
                          <td className="px-4 py-3"><div className="flex items-center justify-center gap-1"><button onClick={() => setEditingProduct({ ...product })} className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white"><Edit3 className="w-4 h-4" /></button><button onClick={() => setDeleteConfirm(product)} className="p-1 hover:bg-red-600/20 rounded text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div></td>
                        </>
                      )}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">제품 삭제</h3>
            <p className="text-slate-400 mb-4">"{deleteConfirm.name}"을(를) 삭제하시겠습니까?</p>
            <div className="flex gap-2">
              <button onClick={() => handleDeleteProduct(deleteConfirm.id)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg">삭제</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 재고 수정 모달 */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-1">재고 수정</h3>
            <p className="text-emerald-400 font-medium mb-4">{showStockModal.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">현재 재고</label>
                <input 
                  type="number" 
                  defaultValue={showStockModal.stock || 0}
                  id="stock-input"
                  min="0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-xl text-center focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const input = document.getElementById('stock-input');
                    input.value = Math.max(0, parseInt(input.value || 0) - 10);
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  -10
                </button>
                <button 
                  onClick={() => {
                    const input = document.getElementById('stock-input');
                    input.value = Math.max(0, parseInt(input.value || 0) - 1);
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  -1
                </button>
                <button 
                  onClick={() => {
                    const input = document.getElementById('stock-input');
                    input.value = parseInt(input.value || 0) + 1;
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  +1
                </button>
                <button 
                  onClick={() => {
                    const input = document.getElementById('stock-input');
                    input.value = parseInt(input.value || 0) + 10;
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  +10
                </button>
              </div>
              
              <div>
                <label className="block text-slate-400 text-sm mb-1">최소 재고 (이하면 부족 경고)</label>
                <input 
                  type="number" 
                  defaultValue={showStockModal.min_stock || 5}
                  id="min-stock-input"
                  min="0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-center focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => {
                  const newStock = document.getElementById('stock-input').value;
                  const newMinStock = document.getElementById('min-stock-input').value;
                  const productData = {
                    ...showStockModal,
                    stock: parseInt(newStock) || 0,
                    min_stock: parseInt(newMinStock) || 5
                  };
                  supabase.updateProduct(showStockModal.id, productData).then(result => {
                    if (result) {
                      showAlert(`재고가 ${newStock}개로 수정되었습니다.`);
                      setShowStockModal(null);
                      loadProducts();
                      onProductsUpdate();
                    } else {
                      showAlert('재고 수정에 실패했습니다.', 'error');
                    }
                  });
                }} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold"
              >
                저장
              </button>
              <button onClick={() => setShowStockModal(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold">취소</button>
            </div>
          </div>
        </div>
      )}

      {alert && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${alert.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'} text-white font-medium animate-fade-in z-50`}>
          {alert.message}
        </div>
      )}
    </div>
  );
}

// ==================== 주문 내역 페이지 ====================
function OrderHistoryPage({ orders, onBack, onDeleteOrder, onDeleteMultipleOrders, onViewOrder, onRefresh, isLoading, formatPrice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(null);

  const filterByDate = (order) => {
    if (dateFilter === 'all') return true;
    const orderDate = new Date(order.date.replace(/\./g, '-'));
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
      monthAgo.setDate(monthAgo.getDate() - 30);
      return orderDate >= monthAgo;
    }
    if (dateFilter === 'custom' && customDate) {
      const selectedDate = new Date(customDate);
      const orderDay = new Date(orderDate);
      selectedDate.setHours(0, 0, 0, 0);
      orderDay.setHours(0, 0, 0, 0);
      return orderDay.getTime() === selectedDate.getTime();
    }
    return true;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) || order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch && filterByDate(order);
  });

  const handleDelete = async (order) => {
    const success = await onDeleteOrder(order.id);
    setDeleteConfirm(null);
    if (success) {
      setDeleteAlert({ type: 'success', message: '주문이 삭제되었습니다.', orderNumber: order.orderNumber });
    } else {
      setDeleteAlert({ type: 'error', message: '삭제에 실패했습니다. 다시 시도해주세요.' });
    }
    setTimeout(() => setDeleteAlert(null), 3000);
  };

  // 선택 토글
  const toggleSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  // 선택 삭제
  const handleBulkDelete = async () => {
    const success = await onDeleteMultipleOrders(selectedOrders);
    setBulkDeleteConfirm(null);
    if (success) {
      setDeleteAlert({ type: 'success', message: `${selectedOrders.length}건의 주문이 삭제되었습니다.` });
      setSelectedOrders([]);
    } else {
      setDeleteAlert({ type: 'error', message: '삭제에 실패했습니다. 다시 시도해주세요.' });
    }
    setTimeout(() => setDeleteAlert(null), 3000);
  };

  // 필터 기준 초기화 (현재 필터의 모든 주문 삭제)
  const handleResetByFilter = () => {
    const filterLabel = {
      'all': '전체',
      'today': '오늘',
      'yesterday': '어제',
      'week': '이번 주',
      'month': '이번 달',
      'custom': customDate
    }[dateFilter];
    
    setBulkDeleteConfirm({
      type: 'filter',
      ids: filteredOrders.map(o => o.id),
      label: filterLabel,
      count: filteredOrders.length
    });
  };

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const isFiltered = dateFilter !== 'all' || searchTerm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="w-full px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">주문 내역</h1>
            </div>
          </div>
          <button onClick={onRefresh} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>
      
      <div className="w-full px-4 lg:px-6 py-4">
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="주문번호, 고객명, 제품명 검색..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[{ value: 'all', label: '전체' }, { value: 'today', label: '오늘' }, { value: 'yesterday', label: '어제' }, { value: 'week', label: '이번 주' }, { value: 'month', label: '이번 달' }, { value: 'custom', label: '날짜 선택' }].map(filter => (
              <button key={filter.value} onClick={() => setDateFilter(filter.value)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${dateFilter === filter.value ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{filter.label}</button>
            ))}
            {dateFilter === 'custom' && <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500" />}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1"><Receipt className="w-4 h-4" /><span className="text-sm">{isFiltered ? '조회 주문' : '총 주문'}</span></div>
            <p className="text-2xl font-bold text-white">{filteredOrders.length}{isFiltered && <span className="text-sm text-slate-500 ml-1">/ {orders.length}</span>}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1"><Calculator className="w-4 h-4" /><span className="text-sm">{isFiltered ? '조회 금액' : '총 매출'}</span></div>
            <p className="text-2xl font-bold text-emerald-400">{formatPrice(totalAmount)}</p>
          </div>
        </div>
        
        {/* 선택/삭제 컨트롤 */}
        {filteredOrders.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
              />
              <span className="text-slate-300 text-sm">전체 선택</span>
            </label>
            
            {selectedOrders.length > 0 && (
              <span className="text-emerald-400 text-sm font-medium">{selectedOrders.length}개 선택됨</span>
            )}
            
            <div className="flex-1" />
            
            {selectedOrders.length > 0 && (
              <button
                onClick={() => setBulkDeleteConfirm({ type: 'selected', ids: selectedOrders, count: selectedOrders.length })}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                선택 삭제 ({selectedOrders.length})
              </button>
            )}
            
            <button
              onClick={handleResetByFilter}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 rounded-lg text-orange-400 text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {dateFilter === 'all' ? '전체 초기화' : dateFilter === 'today' ? '오늘 초기화' : dateFilter === 'yesterday' ? '어제 초기화' : dateFilter === 'week' ? '이번 주 초기화' : dateFilter === 'month' ? '이번 달 초기화' : '선택일 초기화'}
            </button>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center"><RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" /><p className="text-slate-400">불러오는 중...</p></div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center"><History className="w-12 h-12 text-slate-600 mx-auto mb-2" /><p className="text-slate-400">주문 내역이 없습니다.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`bg-slate-800 rounded-xl p-4 transition-colors animate-fade-in ${selectedOrders.includes(order.id) ? 'ring-2 ring-emerald-500 bg-slate-800/80' : 'hover:bg-slate-750'}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="mt-1 w-4 h-4 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-emerald-400 font-mono text-sm">{order.orderNumber}</p>
                        {order.customerName && <p className="text-white font-medium">{order.customerName}</p>}
                        <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{order.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{order.time}</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white">{formatPrice(order.total)}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2 mb-3"><p className="text-slate-400 text-sm truncate">{order.items.map(item => `${item.name}(${item.quantity})`).join(', ')}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => onViewOrder(order)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"><Eye className="w-4 h-4" />상세보기</button>
                      <button onClick={() => setDeleteConfirm(order)} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">주문 삭제</h3>
            <p className="text-slate-400 mb-4">주문번호 <span className="text-emerald-400">{deleteConfirm.orderNumber}</span>를 삭제하시겠습니까?</p>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold transition-colors">삭제</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}
      
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              {bulkDeleteConfirm.type === 'selected' ? '선택 삭제' : '일괄 초기화'}
            </h3>
            <p className="text-slate-400 mb-4">
              {bulkDeleteConfirm.type === 'selected' 
                ? <><span className="text-red-400 font-bold">{bulkDeleteConfirm.count}건</span>의 선택된 주문을 삭제하시겠습니까?</>
                : <><span className="text-orange-400 font-bold">{bulkDeleteConfirm.label}</span> 기간의 <span className="text-red-400 font-bold">{bulkDeleteConfirm.count}건</span> 주문을 모두 삭제하시겠습니까?</>
              }
            </p>
            <p className="text-red-400 text-sm mb-4">⚠️ 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  const success = await onDeleteMultipleOrders(bulkDeleteConfirm.ids);
                  setBulkDeleteConfirm(null);
                  if (success) {
                    setDeleteAlert({ type: 'success', message: `${bulkDeleteConfirm.count}건의 주문이 삭제되었습니다.` });
                    setSelectedOrders([]);
                  } else {
                    setDeleteAlert({ type: 'error', message: '삭제에 실패했습니다.' });
                  }
                  setTimeout(() => setDeleteAlert(null), 3000);
                }} 
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                삭제
              </button>
              <button onClick={() => setBulkDeleteConfirm(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}
      
      {deleteAlert && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl animate-fade-in z-50 ${deleteAlert.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <div className="flex items-center gap-3">
            {deleteAlert.type === 'success' ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
            <div>
              <p className="text-white font-semibold">{deleteAlert.message}</p>
              {deleteAlert.orderNumber && <p className="text-white/80 text-sm">주문번호: {deleteAlert.orderNumber}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 메인 컴포넌트 ====================
export default function PriceCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [cart, setCart] = useState([]);
  const [priceType, setPriceType] = useState('wholesale');
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [savedCarts, setSavedCarts] = useState([]);
  const [isSaveCartModalOpen, setIsSaveCartModalOpen] = useState(false);
  const [isSavedCartsModalOpen, setIsSavedCartsModalOpen] = useState(false);

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
    showToast(`💾 "${name}" 저장됨!`);
  };

  // 저장된 장바구니 불러오기
  const loadSavedCart = (savedCart) => {
    // 현재 제품 목록에서 유효한 제품만 필터링
    const validItems = savedCart.items.filter(item => 
      products.some(p => p.id === item.id)
    ).map(item => {
      const currentProduct = products.find(p => p.id === item.id);
      return {
        ...currentProduct,
        quantity: item.quantity
      };
    });
    
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

  // 토스트 알림 표시
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // 물리 기반 부드러운 스크롤 적용
  useSmoothScroll();

  // 장바구니 localStorage에서 불러오기
  useEffect(() => {
    const savedCart = localStorage.getItem('pos_cart');
    const savedPriceType = localStorage.getItem('pos_priceType');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('장바구니 불러오기 실패:', e);
      }
    }
    if (savedPriceType) {
      setPriceType(savedPriceType);
    }
  }, []);

  // 장바구니 변경 시 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cart));
  }, [cart]);

  // 가격 타입 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pos_priceType', priceType);
  }, [priceType]);

  const loadProducts = async () => {
    setIsProductLoading(true);
    try {
      const data = await supabase.getProducts();
      if (data && data.length > 0) {
        setProducts(data);
        const cats = [...new Set(data.map(p => p.category))];
        setCategories(cats);
        const expanded = {};
        cats.forEach(cat => expanded[cat] = true);
        setExpandedCategories(expanded);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.log('제품 불러오기 실패:', error);
      setIsOnline(false);
    }
    setIsProductLoading(false);
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await supabase.getOrders();
      if (data) {
        const formattedOrders = data.map(order => ({
          id: order.id,
          orderNumber: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          memo: order.memo || '',
          items: order.items,
          total: order.subtotal || order.total || 0,
          priceType: order.price_type,
          date: new Date(order.created_at).toLocaleDateString('ko-KR'),
          time: new Date(order.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }));
        setOrders(formattedOrders);
        setIsOnline(true);
      }
    } catch (error) {
      console.log('주문 불러오기 실패:', error);
    }
    setIsLoading(false);
  };

  const saveOrder = async (orderData) => {
    setIsSaving(true);
    try {
      const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      const supabaseOrder = {
        id: orderNumber,
        customer_name: orderData.customerName || null,
        customer_phone: null,
        memo: orderData.memo || null,
        items: orderData.items,
        subtotal: orderData.total,
        price_type: orderData.priceType
      };
      
      const result = await supabase.saveOrder(supabaseOrder);
      if (result) {
        await loadOrders();
        setCart([]);
        setIsOrderModalOpen(false);
        setIsOnline(true);
      }
    } catch (error) {
      console.error('주문 저장 실패:', error);
    }
    setIsSaving(false);
  };

  const deleteOrder = async (id) => {
    try {
      const success = await supabase.deleteOrder(id);
      if (success) {
        await loadOrders();
        return true;
      }
      return false;
    } catch (error) {
      console.error('주문 삭제 실패:', error);
      return false;
    }
  };

  const deleteMultipleOrders = async (ids) => {
    try {
      let allSuccess = true;
      for (const id of ids) {
        const success = await supabase.deleteOrder(id);
        if (!success) allSuccess = false;
      }
      await loadOrders();
      return allSuccess;
    } catch (error) {
      console.error('주문 일괄 삭제 실패:', error);
      return false;
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const normalizedName = product.name.toLowerCase().replace(/\s/g, '');
      const normalizedSearch = searchTerm.toLowerCase().replace(/\s/g, '');
      const matchesSearch = normalizedName.includes(normalizedSearch);
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

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (id) => { setCart(prev => prev.filter(item => item.id !== id)); };
  const clearCart = () => { setCart([]); };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
      return sum + (price * item.quantity);
    }, 0);
  }, [cart, priceType]);

  const cartTotalVATExcluded = Math.round(cartTotal / 1.1);

  const handleViewOrder = (order) => { setSelectedOrder(order); setIsDetailModalOpen(true); };

  if (currentPage === 'history') {
    return (
      <>
        <OrderHistoryPage orders={orders} onBack={() => setCurrentPage('main')} onDeleteOrder={deleteOrder} onDeleteMultipleOrders={deleteMultipleOrders} onViewOrder={handleViewOrder} onRefresh={loadOrders} isLoading={isLoading} formatPrice={formatPrice} />
        <OrderDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} order={selectedOrder} formatPrice={formatPrice} />
      </>
    );
  }

  if (currentPage === 'admin') {
    return <AdminPage onBack={() => setCurrentPage('main')} formatPrice={formatPrice} onProductsUpdate={loadProducts} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CustomStyles />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} cart={cart} priceType={priceType} formatPrice={formatPrice} onSave={saveOrder} isSaving={isSaving} products={products} />
      <SaveCartModal isOpen={isSaveCartModalOpen} onClose={() => setIsSaveCartModalOpen(false)} onSave={saveCartWithName} cart={cart} priceType={priceType} formatPrice={formatPrice} />
      <SavedCartsModal isOpen={isSavedCartsModalOpen} onClose={() => setIsSavedCartsModalOpen(false)} savedCarts={savedCarts} onLoad={loadSavedCart} onDelete={deleteSavedCart} formatPrice={formatPrice} />

      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
        <div className="w-full px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => { setCurrentPage('main'); setSelectedCategory('전체'); setSearchTerm(''); }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">무브모터스 <span className="text-emerald-400">POS</span></h1>
                <div className="flex items-center gap-1">
                  {isOnline ? (<><Cloud className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 text-xs">클라우드 연결됨</span></>) : (<><WifiOff className="w-3 h-3 text-red-400" /><span className="text-red-400 text-xs">연결 끊김</span></>)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => { setCurrentPage('history'); loadOrders(); }} className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all hover-lift btn-ripple">
                <History className="w-5 h-5 text-white" />
                {orders.length > 0 && <span className="min-w-5 h-5 px-1.5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{orders.length > 99 ? '99+' : orders.length}</span>}
              </button>
              
              <button onClick={() => setActiveTab(activeTab === 'cart' ? 'catalog' : 'cart')} className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-700 rounded-lg hover-lift btn-ripple">
                <ShoppingCart className="w-5 h-5 text-white" />
                {cart.length > 0 && <span className="min-w-5 h-5 px-1.5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
              </button>
              
              <button onClick={() => setCurrentPage('admin')} className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 rounded-lg transition-all hover-lift btn-ripple" title="관리자">
                <Settings className="w-5 h-5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 lg:px-6 py-4 flex flex-col md:flex-row gap-4">
        <div className={`flex-1 ${activeTab === 'cart' ? 'hidden md:block' : ''}`}>
          <div className="bg-slate-800 rounded-xl p-4 mb-4 sticky top-20 z-30 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="제품명 검색..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
              
              <div className="flex gap-2">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 min-w-[120px]">
                  <option value="전체">전체</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                
                <div className="flex bg-slate-700 rounded-lg p-1">
                  <button onClick={() => setPriceType('wholesale')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${priceType === 'wholesale' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>도매가</button>
                  <button onClick={() => setPriceType('retail')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${priceType === 'retail' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>소비자가</button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-3">{filteredProducts.length}개 제품</p>

          {isProductLoading ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center"><RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" /><p className="text-slate-400">제품 불러오는 중...</p></div>
          ) : products.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 mb-4">제품이 없습니다.</p>
              <button onClick={() => setCurrentPage('admin')} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors">관리자 페이지에서 제품 추가</button>
            </div>
          ) : Object.keys(groupedProducts).length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <div key={category} className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden animate-fade-in">
                  <button onClick={() => toggleCategory(category)} className="w-full px-4 py-3 bg-gradient-to-r from-slate-700/80 to-slate-700/50 border-b border-slate-600/50 hover:from-slate-600/80 hover:to-slate-600/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-300 ${expandedCategories[category] ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </span>
                        <span className="font-semibold text-white">{category}</span>
                      </div>
                      <span className="text-xs text-slate-300 bg-slate-600 px-2 py-1 rounded-full">{categoryProducts.length}개</span>
                    </div>
                  </button>
                  
                  {expandedCategories[category] && (
                    <div className="p-2 grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto smooth-scroll">
                      {categoryProducts.map(product => {
                        const price = priceType === 'wholesale' ? product.wholesale : (product.retail || product.wholesale);
                        const vatExcluded = Math.round(price / 1.1);
                        const cartItem = cart.find(item => item.id === product.id);
                        const priceColor = priceType === 'wholesale' ? 'text-emerald-400' : 'text-red-400';
                        const stock = product.stock || 0;
                        const minStock = product.min_stock || 5;
                        const isOutOfStock = stock === 0;
                        const isLowStock = stock > 0 && stock <= minStock;
                        
                        return (
                          <div 
                            key={product.id} 
                            onClick={() => !cartItem && !isOutOfStock && addToCart(product)}
                            className={`px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              isOutOfStock
                                ? 'bg-slate-800/50 opacity-60 cursor-not-allowed border border-slate-700'
                                : cartItem 
                                  ? 'bg-emerald-600/30 border border-emerald-500/50' 
                                  : 'bg-slate-700/30 hover:bg-slate-700/60 border border-transparent hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <p className="text-white text-xs font-medium truncate flex-1">{product.name}</p>
                              {isOutOfStock ? (
                                <span className="text-[10px] px-1.5 py-0.5 bg-red-600/30 text-red-400 rounded shrink-0">품절</span>
                              ) : isLowStock ? (
                                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-600/30 text-yellow-400 rounded shrink-0">{stock}개</span>
                              ) : null}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-bold ${priceColor}`}>{formatPrice(price)}</p>
                                <p className="text-[10px] text-slate-500">VAT제외 {formatPrice(vatExcluded)}</p>
                              </div>
                              
                              {isOutOfStock ? (
                                <X className="w-4 h-4 text-red-500" />
                              ) : cartItem ? (
                                <div className="flex items-center gap-0.5 bg-slate-800 rounded">
                                  <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity - 1); }} className="p-1 hover:bg-slate-600 rounded-l">
                                    <Minus className="w-3 h-3 text-white" />
                                  </button>
                                  <span className="w-5 text-center text-white text-xs font-bold">{cartItem.quantity}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }} className="p-1 hover:bg-slate-600 rounded-r">
                                    <Plus className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <Plus className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`md:w-[450px] lg:w-[500px] ${activeTab === 'catalog' ? 'hidden md:block' : ''} fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto z-40 md:z-auto`}>
          <div className="bg-gradient-to-r from-emerald-900/90 to-teal-900/80 backdrop-blur-md md:rounded-xl border-t-2 md:border border-emerald-500/50 md:sticky md:top-20 shadow-2xl shadow-emerald-900/30 md:shadow-lg animate-slide-in-right">
            <div className="px-4 py-3 border-b border-emerald-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">주문 목록</h2>
                <span className="text-sm text-emerald-300 bg-emerald-800/50 px-2 py-0.5 rounded-full">{cart.length}종 / {cart.reduce((sum, item) => sum + item.quantity, 0)}개</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsSavedCartsModalOpen(true)}
                  className="p-2 hover:bg-emerald-800/50 rounded-lg btn-ripple relative" 
                  title="저장된 장바구니"
                >
                  <Download className="w-5 h-5 text-emerald-400" />
                  {savedCarts.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-violet-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {savedCarts.length > 9 ? '9+' : savedCarts.length}
                    </span>
                  )}
                </button>
                {cart.length > 0 && (
                  <button 
                    onClick={() => setIsSaveCartModalOpen(true)}
                    className="p-2 hover:bg-emerald-800/50 rounded-lg btn-ripple" 
                    title="장바구니 저장"
                  >
                    <Save className="w-5 h-5 text-emerald-400" />
                  </button>
                )}
                <button onClick={() => setActiveTab('catalog')} className="md:hidden p-2 hover:bg-emerald-800/50 rounded-lg btn-ripple"><X className="w-5 h-5 text-emerald-400" /></button>
              </div>
            </div>

            <div className="max-h-60 md:max-h-[400px] overflow-y-auto order-scroll">
              {cart.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-emerald-700 mx-auto mb-2" />
                  <p className="text-emerald-400/70 mb-4">주문 목록이 비어있습니다</p>
                  {savedCarts.length > 0 && (
                    <button 
                      onClick={() => setIsSavedCartsModalOpen(true)}
                      className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 rounded-lg text-violet-300 text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      저장된 장바구니 ({savedCarts.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {cart.map(item => {
                    const price = priceType === 'wholesale' ? item.wholesale : (item.retail || item.wholesale);
                    const itemTotal = price * item.quantity;
                    return (
                      <div key={item.id} className="flex items-center gap-2 py-2 px-3 bg-emerald-950/30 rounded-lg group">
                        <p className="flex-1 text-white text-sm truncate">{item.name}</p>
                        <div className="flex items-center bg-emerald-800/40 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-l-lg text-emerald-300"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-white text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-r-lg text-emerald-300"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="w-20 text-right text-emerald-400 text-sm font-semibold">{formatPrice(itemTotal)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/30 rounded-lg text-red-400"><X className="w-4 h-4" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-emerald-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-300">합계</span>
                  <span className="text-2xl font-bold text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-emerald-400/70">VAT 제외</span>
                  <span className="text-emerald-300">{formatPrice(cartTotalVATExcluded)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => setIsOrderModalOpen(true)} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-semibold transition-all hover-lift btn-ripple"><FileText className="w-5 h-5" />주문서 작성</button>
                  <button onClick={clearCart} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-700/80 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors btn-ripple"><Trash2 className="w-5 h-5" />비우기</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 토스트 알림 */}
      {toast && (
        <div className={`fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl animate-fade-in z-50 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        } text-white font-medium`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
