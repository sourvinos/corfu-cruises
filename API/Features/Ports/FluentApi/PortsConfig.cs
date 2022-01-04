using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Ports {

    internal class PortsConfig : IEntityTypeConfiguration<Port> {

        public void Configure(EntityTypeBuilder<Port> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsPrimary).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Ports).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}