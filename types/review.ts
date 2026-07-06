export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
};
