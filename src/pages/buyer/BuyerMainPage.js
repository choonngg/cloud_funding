// import React from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import '../../styles/BuyerMainPage.css';

// const BuyerMainPage = ({ products, investments }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userId } = location.state || {};

//   // userId가 없으면 로그인 페이지로 리다이렉트
//   if (!userId) {
//     return navigate('/', { replace: true });
//   }

//   // 사용자가 투자한 상품 필터링
//   const myInvestments = investments.filter(inv => inv.userId === userId);
//   const myInvestedProductIds = [...new Set(myInvestments.map(inv => inv.productId))];
//   const myInvestedProducts = products.filter(product => 
//     myInvestedProductIds.includes(product.productId)
//   );

//   // 투자 금액 합계 계산
//   const getInvestmentTotal = (productId) => {
//     return myInvestments
//       .filter(inv => inv.productId === productId)
//       .reduce((sum, inv) => sum + inv.amount, 0);
//   };

//   return (
//     <div className="buyer-main-container">
//       <header className="buyer-header">
//         <h1>구매자 포털</h1>
//         <p>로그인 ID: {userId}</p>
//         <button onClick={() => navigate('/')}>로그아웃</button>
//       </header>

//       <section className="my-investments-section">
//         <h2>내가 투자한 상품</h2>
//         <div className="my-investments-container">
//           {myInvestedProducts.length > 0 ? (
//             myInvestedProducts.map(product => (
//               <div key={product.productId} className="investment-card">
//                 <h3>{product.productName}</h3>
//                 <p>투자 금액: {getInvestmentTotal(product.productId).toLocaleString()}원</p>
//                 <p>달성률: {Math.round((product.currentAmount / product.targetAmount) * 100)}%</p>
//                 <Link 
//                   to={`/buyer/product/${product.productId}`} 
//                   state={{ userId }}
//                   className="view-detail-button"
//                 >
//                   상세 보기
//                 </Link>
//               </div>
//             ))
//           ) : (
//             <p className="no-investments">투자한 상품이 없습니다.</p>
//           )}
//         </div>
//       </section>

//       <section className="available-products-section">
//         <h2>투자 가능한 상품</h2>
//         <div className="products-grid">
//           {products.filter(product => !product.isCompleted && new Date(product.targetDate) > new Date()).map(product => (
//             <div key={product.productId} className="product-card">
//               <h3>{product.productName}</h3>
//               <p className="product-description">{product.description}</p>
//               <div className="product-details">
//                 <p>목표 금액: {product.targetAmount.toLocaleString()}원</p>
//                 <p>현재 금액: {product.currentAmount.toLocaleString()}원</p>
//                 <p>달성률: {Math.round((product.currentAmount / product.targetAmount) * 100)}%</p>
//                 <p>마감일: {new Date(product.targetDate).toLocaleDateString()}</p>
//               </div>
//               <Link 
//                 to={`/buyer/product/${product.productId}`} 
//                 state={{ userId }}
//                 className="invest-button"
//               >
//                 투자하기
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>

//       <footer className="buyer-footer">
//         <p>&copy; 2025 투자 플랫폼</p>
//       </footer>
//     </div>
//   );
// };

// export default BuyerMainPage;

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../../styles/BuyerMainPage.css';

const BuyerMainPage = ({ products, investments }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(null);

  // userId가 없으면 로그인 페이지로 리다이렉트
  if (!userId) {
    return navigate('/', { replace: true });
  }

  // 사용자가 투자한 상품 필터링
  const myInvestments = investments.filter(inv => inv.userId === userId);
  const myInvestedProductIds = [...new Set(myInvestments.map(inv => inv.productId))];
  const myInvestedProducts = products.filter(product => 
    myInvestedProductIds.includes(product.productId)
  );

  // 투자 금액 합계 계산
  const getInvestmentTotal = (productId) => {
    return myInvestments
      .filter(inv => inv.productId === productId)
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  // 잔액 조회 함수 (실제로는 Web3.js 또는 ethers.js를 사용하여 블록체인에서 잔액 조회)
  const checkBalance = async () => {
    try {
      // 실제 구현에서는 다음과 같이 Web3.js를 사용할 수 있습니다:
      // const web3 = new Web3(window.ethereum);
      // const accounts = await web3.eth.getAccounts();
      // const balanceWei = await web3.eth.getBalance(accounts[0]);
      // const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      
      // 테스트용 임시 코드 (실제로는 이 부분을 위의 Web3.js 코드로 대체)
      const mockBalance = 1.5 + Math.random() * 2; // 1.5~3.5 ETH 사이의 랜덤 값
      setBalance(mockBalance.toFixed(4));
      setShowBalance(true);
    } catch (error) {
      console.error('잔액 조회 오류:', error);
      alert('잔액 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="buyer-main-container">
      <header className="buyer-header">
        <h1>구매자 포털</h1>
        <div className="user-info">
          <p>로그인 ID: {userId}</p>
          <div className="balance-section">
            <button onClick={checkBalance} className="balance-button">
              ETH 잔액 조회
            </button>
            {showBalance && (
              <span className="balance-display">{balance} ETH</span>
            )}
          </div>
        </div>
        <button onClick={() => navigate('/')}>로그아웃</button>
      </header>

      {/* 기존 코드는 그대로 유지 */}
      <section className="my-investments-section">
        <h2>내가 투자한 상품</h2>
        <div className="my-investments-container">
          {myInvestedProducts.length > 0 ? (
            myInvestedProducts.map(product => (
              <div key={product.productId} className="investment-card">
                <h3>{product.productName}</h3>
                <p>투자 금액: {getInvestmentTotal(product.productId).toLocaleString()}원</p>
                <p>달성률: {Math.round((product.currentAmount / product.targetAmount) * 100)}%</p>
                <Link 
                  to={`/buyer/product/${product.productId}`} 
                  state={{ userId }}
                  className="view-detail-button"
                >
                  상세 보기
                </Link>
              </div>
            ))
          ) : (
            <p className="no-investments">투자한 상품이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="available-products-section">
        {/* 기존 코드 유지 */}
        {/* ... */}
      </section>

      <footer className="buyer-footer">
        <p>&copy; 2025 투자 플랫폼</p>
      </footer>
    </div>
  );
};

export default BuyerMainPage;