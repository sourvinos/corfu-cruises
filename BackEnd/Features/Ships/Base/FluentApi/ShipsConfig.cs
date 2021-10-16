using BlueWaterCruises.Features.Ships;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class ShipsConfig : IEntityTypeConfiguration<Ship> {

        public void Configure(EntityTypeBuilder<Ship> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ShipOwnerId).IsRequired(true);
            entity.Property(x => x.IMO).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Flag).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.RegistryNo).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Manager).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ManagerInGreece).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Agent).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Ships).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}