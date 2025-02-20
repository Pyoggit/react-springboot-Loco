package com.loco.aroundme.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomRequest {
    private Long sellerId;
    private Long buyerId;
    private Long productId;
}
