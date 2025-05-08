import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// 페이지 컴포넌트 가져오기
import LoginPage from './pages/LoginPage';
import NavigationPage from './pages/NavigationPage';
import BuyerMainPage from './pages/buyer/BuyerMainPage';
import BuyerProductDetail from './pages/buyer/BuyerProductDetail';
import SellerMainPage from './pages/seller/SellerMainPage';
import SellerRegistration from './pages/seller/SellerRegistration';

function App() {
  // localStorage에서 데이터 로드 또는 빈 배열로 초기화
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  
  const [investments, setInvestments] = useState(() => {
    const savedInvestments = localStorage.getItem('investments');
    return savedInvestments ? JSON.parse(savedInvestments) : [];
  });
  
  // 사용자 데이터는 항상 고정
  const [users] = useState([
    { userId: '0000', password: '0000', balance: 2000000 }, // 판매자 계정
    { userId: '1234', password: '1234', balance: 1000000 }, // 구매자 계정 1
    { userId: '5678', password: '5678', balance: 500000 },  // 구매자 계정 2
  ]);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  // 새 상품 등록 함수
  const registerProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      productId: String(products.length + 1),
      currentAmount: 0,
      investors: [],
      registrationDate: new Date().toISOString(),
      isCompleted: false
    };
    setProducts([...products, productWithId]);
    return productWithId;
  };

  // 상품 투자 함수
  const investInProduct = (productId, userId, amount) => {
    // 상품 찾기
    const product = products.find(p => p.productId === productId);
    if (!product) return { success: false, message: '상품을 찾을 수 없습니다.' };

    // 이미 완료된 상품인지 확인
    if (product.isCompleted) {
      return { success: false, message: '이미 투자가 완료된 상품입니다.' };
    }

    // 목표 기간이 지났는지 확인
    const targetDate = new Date(product.targetDate);
    const now = new Date();
    if (now > targetDate) {
      return { success: false, message: '투자 기간이 종료된 상품입니다.' };
    }

    // 투자 기록 추가
    const newInvestment = {
      investmentId: String(investments.length + 1),
      productId,
      userId,
      amount,
      date: new Date().toISOString()
    };
    setInvestments([...investments, newInvestment]);

    // 상품 정보 업데이트
    const updatedProducts = products.map(p => {
      if (p.productId === productId) {
        const newCurrentAmount = p.currentAmount + amount;
        const newInvestors = [...p.investors, { userId, amount }];
        const isCompleted = newCurrentAmount >= p.targetAmount;

        return {
          ...p,
          currentAmount: newCurrentAmount,
          investors: newInvestors,
          isCompleted
        };
      }
      return p;
    });
    setProducts(updatedProducts);

    // 투자 성공 시 목표 금액 달성 여부 확인
    const updatedProduct = updatedProducts.find(p => p.productId === productId);
    if (updatedProduct.currentAmount >= updatedProduct.targetAmount) {
      transferFundsToSeller(productId);
    }

    return { success: true, message: '투자가 완료되었습니다.' };
  };

  // 목표 금액 달성 시 판매자에게 투자금 전달 (실제 구현은 외부에서 진행)
  const transferFundsToSeller = (productId) => {
    const product = products.find(p => p.productId === productId);
    console.log(`${product.sellerId} 판매자에게 ${product.currentAmount}원 전달 완료`);
    // 실제 구현은 별도로 진행
    return { success: true, message: '판매자에게 투자금 전달 완료' };
  };

  // 목표 기간 내 목표 금액 미달성 시 투자자에게 환불 (실제 구현은 외부에서 진행)
  const refundToInvestors = (productId) => {
    const product = products.find(p => p.productId === productId);
    const productInvestments = investments.filter(inv => inv.productId === productId);
    
    productInvestments.forEach(inv => {
      console.log(`${inv.userId} 투자자에게 ${inv.amount}원 환불 완료`);
    });

    // 상품 상태 업데이트 (환불됨)
    const updatedProducts = products.map(p => {
      if (p.productId === productId) {
        return {
          ...p,
          isRefunded: true
        };
      }
      return p;
    });
    setProducts(updatedProducts);

    return { success: true, message: '투자자들에게 환불 완료' };
  };

  // 기간 만료 체크 함수 (실제 프로젝트에서는 스케줄러 등으로 구현)
  const checkExpiredProjects = () => {
    const now = new Date();
    const expiredProjects = products.filter(product => {
      const targetDate = new Date(product.targetDate);
      return !product.isCompleted && !product.isRefunded && now > targetDate;
    });

    expiredProjects.forEach(product => {
      refundToInvestors(product.productId);
    });
  };

  // localStorage 초기화 함수 (개발 중 테스트용)
  const clearStorage = () => {
    localStorage.removeItem('products');
    localStorage.removeItem('investments');
    setProducts([]);
    setInvestments([]);
    console.log('localStorage가 초기화되었습니다.');
  };

  // 개발 중 테스트를 위한 로그 출력
  useEffect(() => {
    console.log('현재 등록된 상품:', products.length);
    console.log('현재 등록된 투자:', investments.length);
  }, [products, investments]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage users={users} clearStorage={clearStorage} />} />
        <Route path="/navigation" element={<NavigationPage />} />
        
        {/* 구매자 라우트 */}
        <Route 
          path="/buyer" 
          element={
            <BuyerMainPage 
              products={products} 
              investments={investments}
            />
          } 
        />
        <Route 
          path="/buyer/product/:productId" 
          element={
            <BuyerProductDetail 
              products={products}
              investInProduct={investInProduct}
            />
          } 
        />
        
        {/* 판매자 라우트 */}
        <Route 
          path="/seller" 
          element={
            <SellerMainPage 
              products={products}
              investments={investments}
            />
          } 
        />
        <Route 
          path="/seller/registration" 
          element={
            <SellerRegistration 
              registerProduct={registerProduct}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;