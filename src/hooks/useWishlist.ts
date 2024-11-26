interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

class WishlistManager {
  private wishlist: Movie[];

  constructor() {
    this.wishlist = this.loadWishlist();
  }

  /**
   * Load wishlist from local storage
   */
  private loadWishlist(): Movie[] {
    const storedWishlist = localStorage.getItem('movieWishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  /**
   * Save wishlist to local storage
   */
  private saveWishlist(): void {
    localStorage.setItem('movieWishlist', JSON.stringify(this.wishlist));
  }

  /**
   * Toggle a movie in the wishlist (add/remove)
   */
  toggleWishlist(movie: Movie): void {
    const index = this.wishlist.findIndex((item) => item.id === movie.id);

    if (index === -1) {
      this.wishlist.push(movie);
    } else {
      this.wishlist.splice(index, 1);
    }

    this.saveWishlist();
  }

  /**
   * Get the current wishlist
   */
  getWishlist(): Movie[] {
    return this.wishlist;
  }

  /**
   * Check if a movie is in the wishlist
   */
  isInWishlist(movieId: number): boolean {
    return this.wishlist.some((movie) => movie.id === movieId);
  }
}

const useWishlist = new WishlistManager();

export default useWishlist;
