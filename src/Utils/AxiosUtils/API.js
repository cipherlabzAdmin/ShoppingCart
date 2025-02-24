// Auth
export const RegisterAPI = '/register'
export const LoginAPI = "/login"
export const ManagerLoginAPI = "/ManagerLogin"
export const SelfAPI = "/self"
export const ForgotPasswordAPI = "/forgot-password"
export const VerifyTokenAPI = "/verify-token"
export const UpdatePasswordAPI = "/update-password"
export const LogoutAPI = "/logout";

//console.log("process.env",);
const LOCAL_API = process.env.API_PROD_URL;
// Theme Option
export const ThemeOptionsAPI = `${LOCAL_API}themeOptions`;

// Category API
export const CategoryAPI = `${LOCAL_API}category`;

// Product API
export const ProductAPI =  `${LOCAL_API}product`;

// Pages API
export const PageAPI =  `${LOCAL_API}page`;

// Theme API
export const ThemeAPI = `${LOCAL_API}theme`;

// Home Pages API
export const HomePageAPI = `${LOCAL_API}home`;

// Blogs API
export const BlogAPI = `${LOCAL_API}blog`

// Tags API
export const TagAPI = `${LOCAL_API}tag`;

// Currency API
export const CurrencyAPI = `${LOCAL_API}currency`;

// Setting API
export const SettingAPI = `${LOCAL_API}settings`;

// Wishlist API
export const WishlistAPI = `${LOCAL_API}wishlist`;

// Cart API
export const AddToCartAPI = `${LOCAL_API}cart`;

// Contact Us API
export const ContactUsAPI = `${LOCAL_API}contact-us`;

// Store API
export const StoreAPI = `${LOCAL_API}store`;

// Compare API
export const CompareAPI =  `${LOCAL_API}compare`;

// Attributes API
export const AttributesAPI = `${LOCAL_API}attribute`;

// Wallet API
export const WalletConsumerAPI =  `${LOCAL_API}wallet/consumer`;

// Address API
export const AddressAPI = `${LOCAL_API}address`;

// Country API
export const CountryAPI = `${LOCAL_API}country`;

// CheckoutAPI
export const CheckoutAPI = `${LOCAL_API}checkout`;

// Orders API
export const OrderAPI =  `${LOCAL_API}order`;

// Verify Payment API
export const VerifyPayment = `${LOCAL_API}verifyPayment`;

// Update Profile API
export const UpdateProfileAPI = `${LOCAL_API}updateProfile`;

// Update Profile API
export const UpdateProfilePasswordAPI = `${LOCAL_API}updatePassword`;

// Update Profile API
export const NotificationAPI =  `${LOCAL_API}notifications`;
export const MarkAsReadAPI =  `${LOCAL_API}notifications/markAsRead`;

// Payment Account API
export const PaymentAccountAPI =  `${LOCAL_API}paymentAccount`;

// Points API
export const PointAPI =  `${LOCAL_API}points/consumer`;

// Refund  API
export const RefundAPI = `${LOCAL_API}refund`;

// Question And Answer API
export const QuestionAnswerAPI =  `${LOCAL_API}question-and-answer`;

// Coupon API
export const CouponAPI = `${LOCAL_API}coupon`;

// FeedBack API
export const FeedBackAPI = `${LOCAL_API}question-and-answer/feedback`;

// Review API
export const ReviewAPI = `${LOCAL_API}review`;

// Order Status API
export const OrderStatusAPI =  `${LOCAL_API}orderStatus`;

// Replace Cart API
export const ReplaceCartAPI = `${LOCAL_API}replace/cart`;

// Faq API
export const FaqAPI = `${LOCAL_API}faq`;

export const RePaymentAPI = `${LOCAL_API}rePayment`;

export const CheckOutForm = `${LOCAL_API}formCheckOut`;