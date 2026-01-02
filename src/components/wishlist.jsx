import { useWishlist } from "react-use-wishlist";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";

const LibraryWishlistButton = ({ product }) => {
  const { items, addWishlistItem, removeWishlistItem } = useWishlist();

  if (!product || product.id == null) return null;

  const productId = String(product.id);

  const isInWishlist = items.some(
    (item) => String(item.id) === productId
  );

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeWishlistItem(productId);
    } else {
      addWishlistItem({
        ...product,
        id: productId, // react-use-wishlist requires string IDs
      });
    }
  };

  return (
    <button onClick={toggleWishlist} aria-label="Toggle wishlist">
      {isInWishlist ? (
        <Favorite color="error" sx={{ fontSize: 18 }} />
      ) : (
        <FavoriteBorderOutlined sx={{ fontSize: 18 }} />
      )}
    </button>
  );
};

export default LibraryWishlistButton;
