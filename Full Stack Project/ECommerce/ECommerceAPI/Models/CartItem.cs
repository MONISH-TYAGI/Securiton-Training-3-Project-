namespace ECommerceAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public Product product { get; set; } = new Product();
    }
}