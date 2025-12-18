'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

export default function ReviewSection({ productId }: { productId: number }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (user) {
      loadUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
    }
  };

  const loadUserReview = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:4000/api/reviews/my-review/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setUserReview(data.data);
      }
    } catch (error) {
      console.error('Lỗi tải đánh giá của tôi:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Đánh giá thành công!');
        setShowReviewForm(false);
        setComment('');
        setRating(5);
        loadReviews();
        loadUserReview();
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate && onRate(star)}
            disabled={!interactive}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingPercentage = (count: number) => {
    if (!stats || stats.total_reviews === 0) return 0;
    return (count / stats.total_reviews) * 100;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

      {/* Rating Overview */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{Number(stats.average_rating || 0).toFixed(1)}</div>
            <div className="flex justify-center mb-2">{renderStars(Math.round(Number(stats.average_rating || 0)))}</div>
            <div className="text-gray-600">{stats.total_reviews} đánh giá</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-12">{star} sao</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all"
                    style={{
                      width: `${getRatingPercentage((stats as any)[`rating_${star}`])}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm w-12 text-right">
                  {(stats as any)[`rating_${star}`]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Review Form */}
      {user && !userReview && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Viết đánh giá
        </button>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Đánh giá của bạn</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Chất lượng sản phẩm</label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Nhận xét</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              required
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">Đánh giá của bạn</h3>
            <span className="text-sm text-gray-600">
              {new Date(userReview.created_at).toLocaleDateString('vi-VN')}
            </span>
          </div>
          {renderStars(userReview.rating)}
          <p className="mt-3 text-gray-700">{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Tất cả đánh giá</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{review.user_name}</div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(review.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
