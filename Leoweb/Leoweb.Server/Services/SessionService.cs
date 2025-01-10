namespace Leoweb.Server.Services;

public class SessionService
{
    private readonly Dictionary<string, string> _sessions = new Dictionary<string, string>();

    public bool SaveSession(string user, string sessionToken)
    {
        if (!_sessions.ContainsValue(user))
        {
            _sessions.Add(sessionToken, user);
            return true;
        }

        return false;
    }

    public string GetUserFromSession(string sessionToken)
    {
        _sessions.TryGetValue(sessionToken, out var user);
        return user;
    }
    
    public void RemoveSession(string sessionToken)
    {
        if (_sessions.ContainsKey(sessionToken))
        {
            _sessions.Remove(sessionToken);
        }
    }

    public bool IsValidSession(string sessionToken)
    {
        return _sessions.ContainsKey(sessionToken);
    }
}