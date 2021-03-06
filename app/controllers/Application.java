package controllers;

import static play.data.Form.form;
import models.User;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.index;
import views.html.login;

public class Application extends Controller {
  
	@Security.Authenticated(Secured.class)
    public static Result index() {
        return ok(index.render(""));
    }
    
    /**
     * Login page.
     */
    public static Result login() {
        return ok(
        	login.render(form(Login.class))
        );
    }
    
    /**
     * Handle login form submission.
     */
    public static Result authenticate() {
        Form<Login> loginForm = form(Login.class).bindFromRequest();
        if(loginForm.hasErrors()) {
            return badRequest(login.render(loginForm));
        } else {
            session("name", loginForm.get().name);
            return redirect(
                routes.Application.index()
            );
        }
    }

    /**
     * Logout and clean the session.
     */
    public static Result logout() {
        session().clear();
        flash("success", "You've been logged out");
        return redirect(
            routes.Application.login()
        );
    }
    
    // -- Authentication
    
    public static class Login {
        
        public String name;
        public String password;
        
        public String validate() {
            if(User.authenticate(name, password) == null) {
                return "Invalid user or password";
            }
            return null;
        }
        
    }
}
