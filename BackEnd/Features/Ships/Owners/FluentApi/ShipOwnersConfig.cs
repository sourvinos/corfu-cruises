using BlueWaterCruises.Features.Ships;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.FluentApi {

    internal class ShipOwnersConfig : IEntityTypeConfiguration<ShipOwner> {

        public void Configure(EntityTypeBuilder<ShipOwner> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Profession).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Address).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.TaxNo).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.City).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Phones).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Email).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).HasMaxLength(36).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.ShipOwners).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}