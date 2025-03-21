﻿using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Leoweb.Server.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Leoweb.Server.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async  Task<Student> GetStudentById(string id)
    {
        return await _context.Student.FirstOrDefaultAsync(s => s.Id == id);
    }
    
    public async Task<bool> StudentExists(string email)
    {
        return await _context.Student.AnyAsync(s => s.Email == email);
    }
    
    public async Task<Student?> IsValidUser(string email, string password)
    {
        var student = await _context.Student.FirstOrDefaultAsync(s => s.Email == email);
    
        if (student == null)
            return null;
        
        if (student.PasswordHash == HashPassword(password))
            return student;
        
        return null;
    }
    
    public async Task<bool> RegisterStudentAsync(string email, string password, string role)
    {
        if(await StudentExists(email))
        {
            return false;
        }
        var student = new Student
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Role = role,
            PasswordHash = HashPassword(password),
            Year = 0,
            Branch = "informatik"
        };


        _context.Student.Add(student);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> ChangePassword(string email, string oldPassword, string newPassword)
    {
        Student? student = await IsValidUser(email, oldPassword);
        if (student != null)
        {
            student.PasswordHash = HashPassword(newPassword);
            _context.Update(student);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<bool> ChangeEmail(string oldemail, string newEmail, string password)
    {
        Student? student = await IsValidUser(oldemail, password);
        if (student != null)
        {
            student.Email = newEmail;
            _context.Update(student);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
    
    public string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashBytes);
        }
    }
}