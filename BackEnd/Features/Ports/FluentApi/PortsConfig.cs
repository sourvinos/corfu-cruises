using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.Features.Ports {

    internal class PortsConfig : IEntityTypeConfiguration<Port> {

        public void Configure(EntityTypeBuilder<Port> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsPrimary).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Ports).HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }

    }

}