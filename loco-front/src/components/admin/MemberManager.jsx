import React, { useState } from "react";
import "@/css/admin/MemberManager.css";

const MemberManager = () => {
  const [members, setMembers] = useState([
    {
      no: 1,
      id: "kkk",
      provider: "kakao",
      phone: "010-1111-1111",
      birth: "2000-01-01",
      region: "서울",
      reg_date: "2025-02-05",
    },
    {
      no: 2,
      id: "ggg",
      provider: "google",
      phone: "010-2222-2222",
      birth: "2000-01-01",
      region: "부산",
      reg_date: "2025-02-04",
    },
    {
      no: 3,
      id: "iii",
      provider: "local",
      phone: "010-3333-3333",
      birth: "2000-01-01",
      region: "대전",
      reg_date: "2025-02-05",
    },
    {
      no: 4,
      id: "jjj",
      provider: "local",
      phone: "010-4444-4444",
      birth: "2000-01-01",
      region: "대구",
      reg_date: "2025-02-06",
    },
    {
      no: 5,
      id: "mmm",
      provider: "naver",
      phone: "010-5555-5555",
      birth: "2000-01-01",
      region: "광주",
      reg_date: "2025-02-07",
    },
    {
      no: 6,
      id: "nnn",
      provider: "kakao",
      phone: "010-6666-6666",
      birth: "2000-01-01",
      region: "인천",
      reg_date: "2025-02-08",
    },
    {
      no: 7,
      id: "ooo",
      provider: "local",
      phone: "010-7777-7777",
      birth: "2000-01-01",
      region: "부산",
      reg_date: "2025-02-09",
    },
    {
      no: 8,
      id: "ppp",
      provider: "google",
      phone: "010-8888-8888",
      birth: "2000-01-01",
      region: "서울",
      reg_date: "2025-02-10",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [thName, setThName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredMembers = members
    .filter((member) =>
      member.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field) => {
    const sortedMembers = [...members].sort((a, b) => {
      if (sortOrder === "asc") {
        return typeof a[field] === "number"
          ? a[field] - b[field]
          : a[field].localeCompare(b[field]);
      } else {
        return typeof a[field] === "number"
          ? b[field] - a[field]
          : b[field].localeCompare(a[field]);
      }
    });
    setMembers(sortedMembers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setThName(field);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setMembers(members.map((member) => ({ ...member, checked: newSelectAll })));
  };

  const handleCheckboxChange = (id) => {
    const updatedMembers = members.map((member) =>
      member.id === id ? { ...member, checked: !member.checked } : member
    );
    setMembers(updatedMembers);
    setSelectAll(updatedMembers.every((member) => member.checked));
  };

  return (
    <div className="admin-member-container">
      <div className="admin-member-header">
        <input
          type="text"
          placeholder="아이디 검색"
          value={searchTerm}
          onChange={handleSearch}
          className="admin-member-search-input"
        />
        <button className="admin-member-delete-btn">삭제</button>
      </div>

      <table className="admin-member-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th onClick={() => handleSort("no")}>
              NO {thName === "no" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("id")}>
              아이디 {thName === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("provider")}>
              로그인유형{" "}
              {thName === "provider" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>전화번호</th>
            <th>생년월일</th>
            <th onClick={() => handleSort("region")}>
              지역{" "}
              {thName === "region" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("reg_date")}>
              계정 생성일{" "}
              {thName === "reg_date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td>
                <input
                  type="checkbox"
                  checked={member.checked || false}
                  onChange={() => handleCheckboxChange(member.id)}
                />
              </td>
              <td>{member.no}</td>
              <td>{member.id}</td>
              <td>{member.provider}</td>
              <td>{member.phone}</td>
              <td>{member.birth}</td>
              <td>{member.region}</td>
              <td>{member.reg_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MemberManager;
