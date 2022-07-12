using API.Infrastructure.Classes;

namespace API.Features.Customers {

    public class CustomerListDto : IEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Phones { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }

    }

}