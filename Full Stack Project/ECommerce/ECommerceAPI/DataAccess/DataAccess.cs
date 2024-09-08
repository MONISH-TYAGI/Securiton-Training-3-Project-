
using ECommerce.API.Models;
using ECommerceAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Reflection;
using System.Reflection.PortableExecutable;
using System.Security.Claims;
using System.Text;

namespace ECommerceAPI.DataAccess
{
    public class DataAccess : IDataAccess
    {
        private readonly IConfiguration configuration;
        private readonly string dbconnection;
        private readonly string dateformat;

        public DataAccess(IConfiguration configuration)
        {
            this.configuration = configuration;
            dbconnection = this.configuration["ConnectionStrings:DB"];
            // Remove the "trust server certificate" keyword from the connection string
            //  dbconnection = dbconnection.Replace(";trust server certificate=true", "");
            dateformat = this.configuration["Constants:DateFormat"];
        }



        public List<ProductCategory> GetProductCategories()
        {
            var productCategories = new List<ProductCategory>();

            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };

                string query = "SELECT * FROM ProductCategories;";
                command.CommandText = query;
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var category = new ProductCategory()
                    {
                        Id = (int)reader["CategoryId"],
                        Category = (string)reader["Category"],
                        SubCategory = (string)reader["SubCategory"],
                    };
                    productCategories.Add(category);

                }
            }


            return productCategories;
        }
        public ProductCategory GetProductCategory(int id) {
            var productCategory = new ProductCategory();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "SELECT * FROM ProductCategories WHERE CategoryId=" + id + ";";
                command.CommandText = query;
                connection.Open();
                SqlDataReader r = command.ExecuteReader();
                while (r.Read())
                {
                    productCategory.Id = (int)r["CategoryId"];
                    productCategory.Category = (string)r["Category"];
                    productCategory.SubCategory = (string)r["SubCategory"];
                }

            }
            return productCategory;
        }
        public Offer GetOffer(int id) {
            var offer = new Offer();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "SELECT * FROM Offers WHERE OfferId=" + id + ";";
                command.CommandText = query;
                connection.Open();
                SqlDataReader r = command.ExecuteReader();
                while (r.Read())
                {
                    offer.Id = (int)r["OfferId"];
                    offer.Title = (string)r["Title"];
                    offer.Discount = (int)r["Discount"];
                }
            }
            return offer;

        }
        public List<Product> GetProducts(string category, string subcategory, int count)
        {
            var products = new List<Product>();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "SELECT TOP " + count + " * FROM Products WHERE CategoryId=(Select CategoryId FROM ProductCategories WHERE Category=@c AND SubCategory=@s) ORDER BY newid();";

                command.CommandText = query;
                command.Parameters.Add("@c", System.Data.SqlDbType.NVarChar).Value = category;
                command.Parameters.Add("@s", System.Data.SqlDbType.NVarChar).Value = subcategory;
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var product = new Product()
                    {
                        Id = (int)reader["ProductId"],
                        Title = (string)reader["Title"],
                        Description = (string)reader["Description"],
                        Price = (double)reader["Price"],
                        Quantity = (int)reader["Quantity"],
                        ImageName = (string)reader["ImageName"]
                    };
                    var categoryid = (int)reader["CategoryId"];
                    product.ProductCategory = GetProductCategory(categoryid);
                    var offerid = (int)reader["OfferId"];
                    product.Offer = GetOffer(offerid);
                    products.Add(product);

                }


            }
            return products;
        }
        public Product GetProduct(int id)
        {
            var product = new Product();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                // var product = new Product();
                string query = "SELECT * FROM Products WHERE ProductId=" + id + ";";
                command.CommandText = query;

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    product.Id = (int)reader["ProductId"];
                    product.Title = (string)reader["Title"];
                    product.Description = (string)reader["Description"];
                    product.Price = (double)reader["Price"];
                    product.Quantity = (int)reader["Quantity"];
                    product.ImageName = (string)reader["ImageName"];
                    var categoryid = (int)reader["CategoryId"];
                    product.ProductCategory = GetProductCategory(categoryid);
                    var offerid = (int)reader["OfferId"];
                    product.Offer = GetOffer(offerid);


                }

            }
            return product;
        }
        public bool InsertUser(User user)
        {
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                connection.Open();
                string query = "Select Count(*) from Users where Email='" + user.Email + "';";
                command.CommandText = query;
                int count = (int)command.ExecuteScalar();
                if (count > 0)
                {
                    connection.Close();
                    return true;
                }
                query = "INSERT INTO USERS(FIrstName,LastName,Address,Mobile,Email,Password,CreatedAt,MOdifiedAt) values (@fn,@ln,@add,@mb,@em,@pwd,@cat,@mat);";
                command.CommandText = query;
                command.Parameters.Add("@fn", System.Data.SqlDbType.NVarChar).Value = user.FirstName;
                command.Parameters.Add("@ln", System.Data.SqlDbType.NVarChar).Value = user.LastName;
                command.Parameters.Add("@add", System.Data.SqlDbType.NVarChar).Value = user.Address;
                command.Parameters.Add("@mb", System.Data.SqlDbType.NVarChar).Value = user.Mobile;
                command.Parameters.Add("@em", System.Data.SqlDbType.NVarChar).Value = user.Email;
                command.Parameters.Add("@pwd", System.Data.SqlDbType.NVarChar).Value = user.Password;
                command.Parameters.Add("@cat", System.Data.SqlDbType.NVarChar).Value = user.CreatedAt;
                command.Parameters.Add("@mat", System.Data.SqlDbType.NVarChar).Value = user.ModifiedAt;
                // command.Parameters.Add("@fn", System.Data.SqlDbType.NVarChar).Value = user.FirstName;
                command.ExecuteNonQuery();
            }
            return true;
        }

        public string IsUserPresent(string email, string password)
        {
            User user = new();
            using (SqlConnection connetion = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connetion,
                };
                connetion.Open();
                string query = "SELECT COUNT(*) FROM USers WHERE Email='" + email + "'AND Password='" + password + "';";
                command.CommandText = query;
                int count = (int)command.ExecuteScalar();
                if (count == 0)
                {
                    connetion.Close();
                    return "";
                }

                query = "SELECT * FROM USers WHERE Email='" + email + "'AND Password='" + password + "';";
                command.CommandText = query;
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read()) {
                    user.Id = (int)reader["userId"];
                    user.FirstName = (string)reader["FirstName"];
                    user.LastName = (string)reader["LastName"];
                    user.Email = (string)reader["Email"];
                    user.Address = (string)reader["Address"];
                    user.Mobile = (string)reader["Mobile"];
                    user.Password = (string)reader["Password"];
                    user.CreatedAt = (string)reader["CreatedAt"];
                    user.ModifiedAt = (string)reader["ModifiedAt"];
                }
                string key = "MNU66iBl3T5rh6H52i69abcdefghijklmno";
                string duration = "60";
                var symmetrickey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
                var credentials = new SigningCredentials(symmetrickey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                new Claim("id",user.Id.ToString()),
                new Claim("firstname",user.FirstName),
                new Claim("lastname",user.LastName),
                new Claim("address",user.Address),
                new Claim("mobile",user.Mobile),
                new Claim("email",user.CreatedAt),
                new Claim("modifiedat",user.ModifiedAt),


            };
                var jwtToken = new JwtSecurityToken(
                    issuer: "localhost",
                    audience: "localhost",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(Int32.Parse(duration)),
                    signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(jwtToken);
            }

            return "";
        }

        public void InsertReview(Review review)
        {
            using SqlConnection connection = new(dbconnection);
            SqlCommand command = new()
            {
                Connection = connection
            };

            string query = "INSERT INTO Reviews (UserId, ProductId, Review, CreatedAt) VALUES (@uid, @pid, @rv, @cat);";
            command.CommandText = query;
            command.Parameters.Add("@uid", System.Data.SqlDbType.Int).Value = review.User.Id;
            command.Parameters.Add("@pid", System.Data.SqlDbType.Int).Value = review.Product.Id;
            command.Parameters.Add("@rv", System.Data.SqlDbType.NVarChar).Value = review.Value;
            command.Parameters.Add("@cat", System.Data.SqlDbType.NVarChar).Value = review.CreatedAt;

            connection.Open();
            command.ExecuteNonQuery();

        }
        public List<Review> GetProductReviews(int productId)
        {
            var reviews = new List<Review>();
            using (SqlConnection connection = new(dbconnection)) {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "SELECT * FROM Reviews WHERE ProductId=" + productId + ";";
                command.CommandText = query;
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var review = new Review()
                    {
                        Id = (int)reader["ReviewId"],
                        Value = (string)reader["Review"],
                        CreatedAt = (string)reader["CreatedAt"]
                    };
                    var userid = (int)reader["UserId"];
                    review.User = GetUser(userid);
                    var productid = (int)reader["ProductId"];
                    review.Product = GetProduct(productId);
                    reviews.Add(review);
                }
            }
            return reviews;
        }
        public User GetUser(int userId)
        {
            var user = new User();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "SELECT * FROM Users WHERE UserId=" + userId + ";";
                command.CommandText = query;
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    user.Id = (int)reader["userId"];
                    user.FirstName = (string)reader["FirstName"];
                    user.LastName = (string)reader["LastName"];
                    user.Email = (string)reader["Email"];
                    user.Address = (string)reader["Address"];
                    user.Mobile = (string)reader["Mobile"];
                    user.Password = (string)reader["Password"];
                    user.CreatedAt = (string)reader["CreatedAt"];
                    user.ModifiedAt = (string)reader["ModifiedAt"];

                }
            }
            return user;
        }

        public List<PaymentMethod> GetPaymentMethods()
        {
            var result = new List<PaymentMethod>();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };

                string query = "SELECT * FROM PaymentMethods;";
                command.CommandText = query;

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    PaymentMethod paymentMethod = new()
                    {
                        Id = (int)reader["PaymentMethodId"],
                        Type = (string)reader["Type"],
                        Provider = (string)reader["Provider"],
                        Available = bool.Parse((string)reader["Available"]),
                        Reason = (string)reader["Reason"]
                    };
                    result.Add(paymentMethod);
                }
            }
            return result;
        }

        public bool InsertCartItem(int userId, int productId)
        {
            var user = new User();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                connection.Open();
                string query = "SELECT Count(*) from Carts WHERE UserId=" + userId + "AND Ordered='false';";
                command.CommandText = query;
                int count = (int)command.ExecuteScalar();
                if (count == 0)
                {
                    query = "INSERT INTO CARTS (UserId,Ordered,OrderedOn) VALUES (" + userId + ", 'false', '');";
                    command.CommandText = query;
                    command.ExecuteNonQuery();

                }
                query = "SELECT CartId FROM CARTS WHERE UserId=" + userId + " AND Ordered='false';";
                command.CommandText = query;
                int cartId = (int)command.ExecuteScalar();

                query = "INSERT INTO CartItems (CartId,ProductId) Values (" + cartId + "," + productId + ");";
                command.CommandText = query;
                command.ExecuteNonQuery();
                return true;

            }

        }
     
        public Cart GetActiveCartOfUser(int userId)
        {
            var cart = new Cart();
            using (SqlConnection con = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = con
                };
                con.Open();
                string query = "SELECT COUNT(*) From Carts WHERE UserId=" + userId + "AND Ordered='false';";
                command.CommandText = query;
                int count = (int)command.ExecuteScalar();
                if (count == 0)
                {
                    return cart;
                }
                query = "Select CartId from Carts Where UserId=" + userId + "And Ordered='false';";
                command.CommandText = query;
                int cartid = (int)command.ExecuteScalar();
                query = "Select * from CartItems where CartId=" + cartid + ";";
                command.CommandText = query;
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read()) {
                    CartItem item = new()
                    {
                        Id = (int)reader["CartItemId"],
                        product = GetProduct((int)reader["ProductId"])
                    };
                    cart.CartItems.Add(item);
                }

                cart.Id = cartid;
                cart.User = GetUser(userId);
                cart.Ordered = false;
                cart.OrderedOn = "";

            }

            return cart;
        }

        public List<Cart> GetAllPreviousCartsOfUser(int userId)
        {
            var carts = new List<Cart>();
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                string query = "Select CartId From Carts where UserId=" + userId + " And Ordered='true';";
                command.CommandText = query;
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var cartid = (int)reader["CartId"];
                    carts.Add(GetCart(cartid));
                }

            }
            return carts;
        }

        public Cart GetCart(int cartid) {
            var cart = new Cart();
            using (SqlConnection connection = new(dbconnection)) {
                SqlCommand command = new()
                {
                    Connection = connection
                };
                connection.Open();
                string query = "Select * from CartItems where CartId=" + cartid + ";";
                command.CommandText = query;
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    CartItem item = new()
                    {
                        Id = (int)reader["CartItemId"],
                        product=GetProduct((int)reader["ProductId"])
                    };
                    cart.CartItems.Add(item);
                }
                reader.Close();
                query = "Select * from Carts where CartId=" + cartid + ";";
                command.CommandText = query;
                reader= command.ExecuteReader();
                while(reader.Read())
                {
                    cart.Id = cartid;
                    cart.User = GetUser((int)reader["UserId"]);
                    cart.Ordered = bool.Parse((string)reader["Ordered"]);
                    cart.OrderedOn = (string)reader["OrderedOn"];
                }
                reader.Close();

            }
            return cart;
        }

        public int InsertPayment(Payment payment)
        {
            int value = 0;
            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };

                string query = @"INSERT INTO Payments (PaymentMethodId, UserId, TotalAmount, ShippingCharges, AmountReduced, AmountPaid, CreatedAt) 
                                VALUES (@pmid, @uid, @ta, @sc, @ar, @ap, @cat);";

                command.CommandText = query;
                command.Parameters.Add("@pmid", System.Data.SqlDbType.Int).Value = payment.PaymentMethod.Id;
                command.Parameters.Add("@uid", System.Data.SqlDbType.Int).Value = payment.User.Id;
                command.Parameters.Add("@ta", System.Data.SqlDbType.NVarChar).Value = payment.TotalAmount;
                command.Parameters.Add("@sc", System.Data.SqlDbType.NVarChar).Value = payment.ShipingCharges;
                command.Parameters.Add("@ar", System.Data.SqlDbType.NVarChar).Value = payment.AmountReduced;
                command.Parameters.Add("@ap", System.Data.SqlDbType.NVarChar).Value = payment.AmountPaid;
                command.Parameters.Add("@cat", System.Data.SqlDbType.NVarChar).Value = payment.CreatedAt;

                connection.Open();
                value = command.ExecuteNonQuery();

                if (value > 0)
                {
                    query = "SELECT TOP 1 Id FROM Payments ORDER BY Id DESC;";
                    command.CommandText = query;
                    value = (int)command.ExecuteScalar();
                }
                else
                {
                    value = 0;
                }
            }
            return value;
        }
        public int InsertOrder(Order order)
        {
            int value = 0;

            using (SqlConnection connection = new(dbconnection))
            {
                SqlCommand command = new()
                {
                    Connection = connection
                };

                string query = "INSERT INTO Orders (UserId, CartId, PaymentId, CreatedAt) values (@uid, @cid, @pid, @cat);";

                command.CommandText = query;
                command.Parameters.Add("@uid", System.Data.SqlDbType.Int).Value = order.User.Id;
                command.Parameters.Add("@cid", System.Data.SqlDbType.Int).Value = order.Cart.Id;
                command.Parameters.Add("@cat", System.Data.SqlDbType.NVarChar).Value = order.CreatedAt;
                command.Parameters.Add("@pid", System.Data.SqlDbType.Int).Value = order.Payment.Id;

                connection.Open();
                value = command.ExecuteNonQuery();

                if (value > 0)
                {
                    query = "UPDATE Carts SET Ordered='true', OrderedOn='" + DateTime.Now.ToString(dateformat) + "' WHERE CartId=" + order.Cart.Id + ";";
                    command.CommandText = query;
                    command.ExecuteNonQuery();

                    query = "SELECT TOP 1 Id FROM Orders ORDER BY Id DESC;";
                    command.CommandText = query;
                    value = (int)command.ExecuteScalar();
                }
                else
                {
                    value = 0;
                }
            }

            return value;
        }


    }
}

