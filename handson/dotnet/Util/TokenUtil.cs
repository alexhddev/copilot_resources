namespace AwesomePizza.Util;

public static class TokenUtil
{
    public static string? ExtractBearerToken(HttpRequest request)
    {
        var authHeader = request.Headers.Authorization.ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return null;
        }
        return authHeader[7..];
    }
}
