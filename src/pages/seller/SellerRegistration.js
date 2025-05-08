import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/SellerRegistration.css';

const SellerRegistration = ({ registerProduct }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  // 폼 상태 관리
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // userId가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!userId) {
      navigate('/', { replace: true });
    }
  }, [userId, navigate]);

  // 최소 날짜 설정 (오늘 이후로만 설정 가능)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // 한 자리 숫자일 경우 앞에 0 추가
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력 값 검증
    if (!productName || !description || !targetAmount || !targetDate) {
      setMessage('모든 필드를 입력해주세요.');
      setMessageType('error');
      return;
    }

    // 상품 등록 (기본 이미지 URL 사용)
    const placeholderImage = `https://via.placeholder.com/400x300?text=${encodeURIComponent(productName)}`;
    
    const newProduct = {
      productName,
      description,
      targetAmount: parseInt(targetAmount),
      targetDate,
      sellerId: userId,
      image: placeholderImage
    };

    const registeredProduct = registerProduct(newProduct);

    if (registeredProduct) {
      setMessage('상품이 성공적으로 등록되었습니다.');
      setMessageType('success');
      
      // 등록 성공 시 잠시 후 판매자 메인 페이지로 이동
      setTimeout(() => {
        navigate('/seller', { state: { userId } });
      }, 2000);
    } else {
      setMessage('상품 등록에 실패했습니다. 다시 시도해주세요.');
      setMessageType('error');
    }
  };

  return (
    <div className="seller-registration-container">
      <header className="registration-header">
        <button onClick={() => navigate('/seller', { state: { userId } })}>
          &larr; 목록으로 돌아가기
        </button>
        <h1>상품 등록</h1>
        <p>판매자 ID: {userId}</p>
      </header>

      <div className="registration-content">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName">상품명</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="상품명을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">상품 설명</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품에 대한 상세 설명을 입력하세요"
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetAmount">목표 금액 (원)</label>
              <input
                type="number"
                id="targetAmount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="목표 금액을 입력하세요"
                min="10000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetDate">목표 기간</label>
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getMinDate()}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="register-button">
              상품 등록
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/seller', { state: { userId } })}
            >
              취소
            </button>
          </div>
        </form>
      </div>

      <footer className="registration-footer">
        <p>&copy; 2025 투자 플랫폼</p>
      </footer>
    </div>
  );
};

export default SellerRegistration;