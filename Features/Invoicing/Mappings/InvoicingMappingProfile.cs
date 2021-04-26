using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class InvoicingMappingProfile : Profile {

        public InvoicingMappingProfile() {
            CreateMap<InvoicingGroup, InvoicingReadResource>();
        }

    }

}