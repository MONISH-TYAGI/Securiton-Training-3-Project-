﻿namespace ECommerceAPI.Models
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; } = "";
    }
}
