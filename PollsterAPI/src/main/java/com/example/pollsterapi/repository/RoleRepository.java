package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.ERole;
import com.example.pollsterapi.models.documents.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
