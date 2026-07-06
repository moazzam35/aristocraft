"use client";

import { useState, useEffect } from "react";
import StarIcon from "lucide-react/dist/esm/icons/star";
import MessageSquareIcon from "lucide-react/dist/esm/icons/message-square";
import { useToast } from "@/components/ui/toast";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

type ReviewSectionProps = {
  productId: string;
  currentUser: any; // User object from store
};

export default function ReviewSection({ productId, currentUser }: ReviewSectionProps) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setReviews(data.reviews);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setComment("");
        setRating(5);
        showToast("Review submitted successfully!", "success");
      } else {
        showToast(data.message || "Failed to submit review.", "error");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyReviewed = currentUser && reviews.some((r) => r.user.id === currentUser.id);

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16 pt-16 border-t" style={{ borderColor: "#1C1C1C14" }}>
      <h2 className="text-2xl font-light mb-8 text-neutral-900">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Summary & Submission */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border" style={{ borderColor: "#1C1C1C0D" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Average Rating</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-light text-neutral-900">{averageRating}</span>
              <span className="text-sm text-neutral-500">out of 5</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={18}
                  fill={star <= Math.round(Number(averageRating)) ? "#fa843e" : "transparent"}
                  stroke={star <= Math.round(Number(averageRating)) ? "#fa843e" : "#1C1C1C26"}
                />
              ))}
              <span className="text-xs text-neutral-500 ml-2">({totalReviews} {totalReviews === 1 ? "review" : "reviews"})</span>
            </div>
          </div>

          {/* Form */}
          {currentUser ? (
            alreadyReviewed ? (
              <p className="text-sm text-neutral-500 italic bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                You have already reviewed this product.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-neutral-800">Write a Review</p>
                
                {/* Star rating selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Your Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-0.5 text-neutral-300 hover:scale-110 transition-transform"
                      >
                        <StarIcon
                          size={22}
                          fill={(hoverRating !== null ? star <= hoverRating : star <= rating) ? "#fa843e" : "transparent"}
                          stroke={(hoverRating !== null ? star <= hoverRating : star <= rating) ? "#fa843e" : "#1C1C1C44"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="review-comment" className="text-xs font-semibold text-neutral-500">YOUR COMMENT</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts on the quality, craft, and fit..."
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none font-light transition-all bg-white placeholder:text-neutral-300 focus:border-[#004B47] focus:shadow-[0_0_0_3px_rgba(0,75,71,0.1)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="w-full py-3 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#004B47" }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )
          ) : (
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border text-center" style={{ borderColor: "#1C1C1C0D" }}>
              <p className="text-sm font-medium text-neutral-900 mb-3">Own this product?</p>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Please log in to share your experience with other customers.</p>
              <a
                href="/login"
                className="inline-flex justify-center items-center px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#004B47" }}
              >
                Log In
              </a>
            </div>
          )}
        </div>

        {/* Right: Reviews List */}
        <div className="flex-1 flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="border-b pb-6 flex flex-col gap-2">
                  <div className="h-4 w-32 bg-neutral-100 rounded" />
                  <div className="h-3 w-16 bg-neutral-100 rounded" />
                  <div className="h-10 w-full bg-neutral-100 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 gap-3 border border-dashed rounded-2xl">
              <MessageSquareIcon size={32} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">No reviews yet</p>
                <p className="text-xs mt-1">Be the first to review this product!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="pb-6 border-b flex flex-col gap-3" style={{ borderColor: "#1C1C1C0D" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{rev.user.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            size={12}
                            fill={star <= rev.rating ? "#fa843e" : "transparent"}
                            stroke={star <= rev.rating ? "#fa843e" : "#1C1C1C26"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-neutral-600 italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
