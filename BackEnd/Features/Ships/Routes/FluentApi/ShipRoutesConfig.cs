using BlueWaterCruises.Features.ShipRoutes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class ShipRoutesConfig : IEntityTypeConfiguration<ShipRoute> {

        public void Configure(EntityTypeBuilder<ShipRoute> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.FromPort).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.FromTime).HasMaxLength(5).IsRequired(true);
            entity.Property(x => x.ViaPort).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ViaTime).HasMaxLength(5).IsRequired(true);
            entity.Property(x => x.ToPort).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ToTime).HasMaxLength(5).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.ShipRoutes).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}