// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import '../../styles/BuyerProductDetail.css';

// const BuyerProductDetail = ({ products, investInProduct }) => {
//   const { productId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userId } = location.state || {};
//   const [amount, setAmount] = useState('');
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   // userId가 없으면 로그인 페이지로 리다이렉트
//   useEffect(() => {
//     if (!userId) {
//       navigate('/', { replace: true });
//     }
//   }, [userId, navigate]);

//   // 상품 정보 찾기
//   const product = products.find(p => p.productId === productId);

//   // 상품이 없을 경우
//   if (!product) {
//     return (
//       <div className="product-detail-container">
//         <div className="error-message">
//           <h2>상품을 찾을 수 없습니다.</h2>
//           <button onClick={() => navigate('/buyer', { state: { userId } })}>
//             상품 목록으로 돌아가기
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 투자 가능 여부 확인
//   const isInvestable = !product.isCompleted && new Date(product.targetDate) > new Date();

//   // 남은 기간 계산
//   const getDaysRemaining = () => {
//     const today = new Date();
//     const targetDate = new Date(product.targetDate);
//     const timeDiff = targetDate.getTime() - today.getTime();
//     return Math.ceil(timeDiff / (1000 * 3600 * 24));
//   };

//   // 투자 처리
//   const handleInvest = () => {
//     // 입력값 확인
//     if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
//       setMessage('유효한 금액을 입력해주세요.');
//       setMessageType('error');
//       return;
//     }

//     // 투자 처리
//     const result = investInProduct(productId, userId, parseInt(amount));
    
//     if (result.success) {
//       setMessage(result.message);
//       setMessageType('success');
//       setAmount('');
//       // 투자 성공 시 잠시 후 목록 페이지로 이동
//       setTimeout(() => {
//         navigate('/buyer', { state: { userId } });
//       }, 2000);
//     } else {
//       setMessage(result.message);
//       setMessageType('error');
//     }
//   };

//   return (
//     <div className="product-detail-container">
//       <header className="product-detail-header">
//         <button onClick={() => navigate('/buyer', { state: { userId } })}>
//           &larr; 목록으로 돌아가기
//         </button>
//         <h1>상품 상세 정보</h1>
//         <p>로그인 ID: {userId}</p>
//       </header>

//       <div className="product-detail-content">
//         <div className="product-detail-info">
//           <h2>{product.productName}</h2>
//           <p className="product-description">{product.description}</p>
          
//           <div className="product-stats">
//             <div className="stat-item">
//               <span className="stat-label">목표 금액:</span> 
//               <span className="stat-value">{product.targetAmount.toLocaleString()}원</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-label">현재 모집액:</span> 
//               <span className="stat-value">{product.currentAmount.toLocaleString()}원</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-label">달성률:</span> 
//               <span className="stat-value">
//                 {Math.round((product.currentAmount / product.targetAmount) * 100)}%
//               </span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-label">마감일:</span> 
//               <span className="stat-value">{new Date(product.targetDate).toLocaleDateString()}</span>
//             </div>
//             <div className="stat-item">
//               <span className="stat-label">남은 기간:</span> 
//               <span className="stat-value">{getDaysRemaining()}일</span>
//             </div>
//           </div>

//           {isInvestable ? (
//             <div className="investment-form">
//               <h3>투자하기</h3>
//               {message && (
//                 <div className={`message ${messageType}`}>
//                   {message}
//                 </div>
//               )}
//               <div className="input-group">
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="투자 금액 입력 (원)"
//                   min="1000"
//                 />
//                 <button onClick={handleInvest}>투자 신청</button>
//               </div>
//               <p className="investment-note">
//                 * 최소 투자 금액은 1,000원입니다.
//               </p>
//             </div>
//           ) : (
//             <div className="investment-closed">
//               <p>
//                 {product.isCompleted 
//                   ? "이 상품은 목표 금액이 달성되어 투자가 마감되었습니다." 
//                   : "이 상품은 투자 기간이 종료되었습니다."}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       <footer className="product-detail-footer">
//         <p>&copy; 2025 투자 플랫폼</p>
//       </footer>
//     </div>
//   );
// };

// export default BuyerProductDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/BuyerProductDetail.css';

const BuyerProductDetail = ({ products, investInProduct }) => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(null);

  // 잔액 조회 함수
  const checkBalance = async () => {
    try {
      // 실제 구현에서는 Web3.js 코드로 대체
      const mockBalance = 1.5 + Math.random() * 2; 
      setBalance(mockBalance.toFixed(4));
      setShowBalance(true);
    } catch (error) {
      console.error('잔액 조회 오류:', error);
      alert('잔액 조회 중 오류가 발생했습니다.');
    }
  };

  // userId가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!userId) {
      navigate('/', { replace: true });
    }
  }, [userId, navigate]);

  // 상품 정보 찾기
  const product = products.find(p => p.productId === productId);

  // 상품이 없을 경우
  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <h2>상품을 찾을 수 없습니다.</h2>
          <button onClick={() => navigate('/buyer', { state: { userId } })}>
            상품 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 나머지 함수들은 그대로 유지...

  return (
    <div className="product-detail-container">
      <header className="product-detail-header">
        <button onClick={() => navigate('/buyer', { state: { userId } })}>
          &larr; 목록으로 돌아가기
        </button>
        <h1>상품 상세 정보</h1>
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
      </header>

      {/* 나머지 JSX는 그대로 유지... */}
    </div>
  );
};

export default BuyerProductDetail;