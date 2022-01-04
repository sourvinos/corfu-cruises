using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Routes {

    internal class RoutesConfig : IEntityTypeConfiguration<Route> {

        public void Configure(EntityTypeBuilder<Route> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.PortId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Abbreviation).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsTransfer).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.Port).WithMany(x => x.Routes).HasForeignKey(x => x.PortId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Routes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}