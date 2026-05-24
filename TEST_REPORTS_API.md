# Testing Reports API Issue

## Steps to Debug:

1. **Check if you're logged in:**
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - If it returns `null`, you need to log in first

2. **Check if server is running:**
   - Server is running on port 3000 ✅ (confirmed)

3. **Test the API manually:**
   - Log in to the application first
   - Then check the left sidebar

## Common Issues:

### Issue 1: Not Logged In
**Solution:** Log in to the application first at `login.html`

### Issue 2: Token Expired
**Solution:** Log out and log in again

### Issue 3: Database Connection Error
**Solution:** Check if MySQL is running

## Quick Fix:

The error "Server error" in the left box means one of these:
- You're not logged in (no token)
- Token is invalid/expired
- Database connection issue
- The endpoint is returning a 500 error

Try this:
1. Log out (if logged in)
2. Log in again
3. Go to home page
4. The cases should load

If still not working, open browser console and share the exact error message.
