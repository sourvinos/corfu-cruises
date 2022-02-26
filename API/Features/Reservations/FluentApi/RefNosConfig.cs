using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Reservations {

    internal class RefNosConfig : IEntityTypeConfiguration<RefNo> {

        public void Configure(EntityTypeBuilder<RefNo> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.LastRefNo);
        }

    }

}