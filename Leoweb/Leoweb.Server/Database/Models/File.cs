﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Leoweb.Server.Database.Models
{
    public class File
    {
		[Key]
		public int Id { get; set; }
		public Year Year { get; set; }
		public Subject Subject { get; set; }

        [ForeignKey(nameof(Data))]
        public int DataId { get; set; }
        public DateOnly Date { get; set; }
        [ForeignKey(nameof(Student))]
        public required string StudentId { get; set; }

		public Student Student { get; set; }
		public BinaryFile Data { get; set; }
	}
}
