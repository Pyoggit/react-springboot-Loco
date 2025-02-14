package com.loco.aroundme.controller;

import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final UsersMapper usersMapper;

    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = usersMapper.findAllUsers(); 
        return ResponseEntity.ok(users);
    }
}

