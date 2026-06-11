package com.assignment.auth.service;

import com.assignment.auth.entity.User;
import com.assignment.auth.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * ===================================================================
 * Component: Custom User Details Service
 * 
 * Why it exists:
 * Spring Security needs a standard way to load user-specific data from
 * the data store during authentication. This service implements the
 * UserDetailsService interface to provide that bridge.
 * 
 * Responsibility:
 * - Fetch a user profile from the database using the unique email address.
 * - Translate the User Entity to Spring Security's UserDetails interface.
 * - Assign the proper role authority (prefixed with "ROLE_" for Spring Security Role validation).
 * 
 * Interactions:
 * - Queries the database via UserRepository.
 * - Used by Spring Security's AuthenticationManager during login validation.
 * ===================================================================
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a user by their email address.
     * 
     * @param username the user's email address
     * @return UserDetails representation of the user
     * @throws UsernameNotFoundException if the email is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // Note: Spring Security requires role authority to be prefixed with "ROLE_" to use hasRole() checks
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
