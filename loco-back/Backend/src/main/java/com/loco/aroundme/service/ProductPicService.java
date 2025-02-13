package com.loco.aroundme.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProductPicService {

	String saveImage(MultipartFile image);

}
