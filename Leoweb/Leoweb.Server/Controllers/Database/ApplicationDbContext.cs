<<<<<<< HEAD
﻿using Leoweb.Server.Controllers.Database;
using Leoweb.Server.Controllers.Database.Models;
=======
﻿using Leoweb.Server.Controllers.Database.Models;
>>>>>>> 7591059a793893f6fb6dff24120e227a92981830
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    
}