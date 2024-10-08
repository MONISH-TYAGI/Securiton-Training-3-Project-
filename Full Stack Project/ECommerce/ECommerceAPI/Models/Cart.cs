﻿namespace ECommerceAPI.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public User User { get; set; }
        public List<CartItem> CartItems { get; set; } = new();
        public bool Ordered { get; set; }
        public string OrderedOn { get; set; }=string.Empty;

    }
}
