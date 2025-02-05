package com.loco.aroundme.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

@Configuration
@MapperScan(basePackages = "com.loco.aroundme.mapper")
public class MyBatisConfig {

	@Bean
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		sessionFactory.setDataSource(dataSource);

		// MyBatis 설정 파일 지정 (mybatis-config.xml이 존재해야 함)
		sessionFactory.setConfigLocation(new org.springframework.core.io.ClassPathResource("mybatis-config.xml"));

		// Mapper XML 위치 설정 추가 (mappers 폴더 안의 모든 XML 매핑)
		sessionFactory.setMapperLocations(
				new PathMatchingResourcePatternResolver().getResources("classpath*:com/loco/aroundme/mapper/*.xml"));

		return sessionFactory.getObject();
	}
}
