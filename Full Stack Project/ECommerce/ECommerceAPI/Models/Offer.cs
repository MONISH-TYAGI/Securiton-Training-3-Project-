﻿using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Models
{
    public class Offer 
    {
     public int Id { get; set; }
        public string Title { get; set; } = "";
        public int Discount { get; set; } = 0;
    }
}
