// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../../styles/SellerMainPage.css';

// const SellerMainPage = ({ products, investments }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userId } = location.state || {};
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // userId가 없으면 로그인 페이지로 리다이렉트
//   if (!userId) {
//     return navigate('/', { replace: true });
//   }

//   // 판매자의 상품 필터링
//   const sellerProducts = products.filter(product => product.sellerId === userId);

//   // 상품 선택 처리
//   const handleProductClick = (product) => {
//     setSelectedProduct(product);
//   };

//   // 상품 등록 페이지로 이동
//   const handleRegistrationClick = () => {
//     navigate('/seller/registration', { state: { userId } });
//   };

//   // 특정 상품의 투자자 목록 가져오기
//   const getInvestorDetails = (productId) => {
//     const product = products.find(p => p.productId === productId);
//     return product ? product.investors : [];
//   };

//   // 목표 달성 여부 확인
//   const isTargetAchieved = (product) => {
//     return product.currentAmount >= product.targetAmount;
//   };

//   // 남은 기간 계산
//   const getDaysRemaining = (targetDate) => {
//     const today = new Date();
//     const target = new Date(targetDate);
//     const timeDiff = target.getTime() - today.getTime();
//     return Math.ceil(timeDiff / (1000 * 3600 * 24));
//   };

//   return (
//     <div className="seller-main-container">
//       <header className="seller-header">
//         <h1>판매자 포털</h1>
//         <p>로그인 ID: {userId}</p>
//         <div className="header-buttons">
//           <button onClick={handleRegistrationClick} className="register-product-button">
//             상품 등록하기
//           </button>
//           <button onClick={() => navigate('/')} className="logout-button">
//             로그아웃
//           </button>
//         </div>
//       </header>

//       <div className="seller-content">
//         <div className="product-list-section">
//           <h2>내 상품 목록</h2>
//           {sellerProducts.length > 0 ? (
//             <div className="product-list">
//               {sellerProducts.map(product => (
//                 <div 
//                   key={product.productId} 
//                   className={`product-item ${selectedProduct && selectedProduct.productId === product.productId ? 'selected' : ''}`}
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <div className="product-info">
//                     <h3>{product.productName}</h3>
//                     <p className="product-description">{product.description.substring(0, 80)}...</p>
//                     <div className="product-stats">
//                       <p>목표 금액: {product.targetAmount.toLocaleString()}원</p>
//                       <p>현재 모집액: {product.currentAmount.toLocaleString()}원</p>
//                       <p>달성률: {Math.round((product.currentAmount / product.targetAmount) * 100)}%</p>
//                       <p className={`target-status ${isTargetAchieved(product) ? 'achieved' : ''}`}>
//                         {isTargetAchieved(product) ? '목표 달성 ✓' : '목표 미달성'}
//                       </p>
//                       <p>
//                         {new Date(product.targetDate) > new Date() 
//                           ? `남은 기간: ${getDaysRemaining(product.targetDate)}일` 
//                           : '모집 기간 종료'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="no-products">등록한 상품이 없습니다.</p>
//           )}
//         </div>

//         {selectedProduct && (
//           <div className="investor-details-section">
//             <h2>{selectedProduct.productName} 투자자 목록</h2>
            
//             <div className="product-summary">
//               <p>목표 금액: {selectedProduct.targetAmount.toLocaleString()}원</p>
//               <p>현재 모집액: {selectedProduct.currentAmount.toLocaleString()}원</p>
//               <p>달성률: {Math.round((selectedProduct.currentAmount / selectedProduct.targetAmount) * 100)}%</p>
//               <p>마감일: {new Date(selectedProduct.targetDate).toLocaleDateString()}</p>
//             </div>
            
//             <div className="investors-list">
//               <h3>투자자 정보</h3>
//               {selectedProduct.investors.length > 0 ? (
//                 <table className="investors-table">
//                   <thead>
//                     <tr>
//                       <th>투자자 ID</th>
//                       <th>투자 금액</th>
//                       <th>투자 비율</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedProduct.investors.map((investor, index) => (
//                       <tr key={index}>
//                         <td>{investor.userId}</td>
//                         <td>{investor.amount.toLocaleString()}원</td>
//                         <td>{Math.round((investor.amount / selectedProduct.currentAmount) * 100)}%</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td><strong>합계</strong></td>
//                       <td><strong>{selectedProduct.currentAmount.toLocaleString()}원</strong></td>
//                       <td><strong>100%</strong></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               ) : (
//                 <p className="no-investors">아직 투자자가 없습니다.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       <footer className="seller-footer">
//         <p>&copy; 2025 투자 플랫폼</p>
//       </footer>
//     </div>
//   );
// };

// export default SellerMainPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/SellerMainPage.css';

const SellerMainPage = ({ products, investments }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(null);

  // userId가 없으면 로그인 페이지로 리다이렉트
  if (!userId) {
    return navigate('/', { replace: true });
  }

  // 판매자의 상품 필터링
  const sellerProducts = products.filter(product => product.sellerId === userId);

  // 잔액 조회 함수 (실제로는 Web3.js 또는 ethers.js를 사용하여 블록체인에서 잔액 조회)
  const checkBalance = async () => {
    try {
      // 실제 구현에서는 다음과 같이 Web3.js를 사용할 수 있습니다:
      // const web3 = new Web3(window.ethereum);
      // const accounts = await web3.eth.getAccounts();
      // const balanceWei = await web3.eth.getBalance(accounts[0]);
      // const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      
      // 테스트용 임시 코드 (실제로는 이 부분을 위의 Web3.js 코드로 대체)
      const mockBalance = 5 + Math.random() * 3; // 5~8 ETH 사이의 랜덤 값
      setBalance(mockBalance.toFixed(4));
      setShowBalance(true);
    } catch (error) {
      console.error('잔액 조회 오류:', error);
      alert('잔액 조회 중 오류가 발생했습니다.');
    }
  };

  // 기존 함수들...
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleRegistrationClick = () => {
    navigate('/seller/registration', { state: { userId } });
  };

  const getInvestorDetails = (productId) => {
    const product = products.find(p => p.productId === productId);
    return product ? product.investors : [];
  };

  const isTargetAchieved = (product) => {
    return product.currentAmount >= product.targetAmount;
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const timeDiff = target.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="seller-main-container">
      <header className="seller-header">
        <h1>판매자 포털</h1>
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
        <div className="header-buttons">
          <button onClick={handleRegistrationClick} className="register-product-button">
            상품 등록하기
          </button>
          <button onClick={() => navigate('/')} className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      {/* 기존 코드는 그대로 유지 */}
      <div className="seller-content">
        {/* ... */}
      </div>

      <footer className="seller-footer">
        <p>&copy; 2025 투자 플랫폼</p>
      </footer>
    </div>
  );
};

export default SellerMainPage;