using System;

namespace BlueWaterCruises.Infrastructure.Auth {

    public class Token {

        // PK
        public int Id { get; set; }
        // FKs
        public string ClientId { get; set; }
        public string UserId { get; set; }
        // Fields
        public string Value { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public DateTime ExpiryTime { get; set; }

    }

}