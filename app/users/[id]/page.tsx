// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs"; 

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await apiService.get<User>(`/users/${id}`);
        setUser(userData);
        form.setFieldsValue({
          username: userData.username,
          birthday: userData.birthday ? dayjs(userData.birthday) : null,
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUser();
  }, [id, apiService, form]);

  const handleUpdate = async (values: { username: string; birthday: dayjs.Dayjs | null }) => {
    try {
      await apiService.put(`/users/${id}`, {
        username: values.username,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      });
      alert("Profile updated successfully!");
      router.refresh(); 
    } catch (error) {
      alert(`Error updating profile: ${error}`);
    }
  };

  return (
    <div className="profile-container">
      <Card title="User Profile" loading={!user}>
        {user && (
          <>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Online Status:</strong> {user.status}</p>
            <p><strong>Creation Date:</strong> {dayjs(user.creationDate).format("YYYY-MM-DD")}</p>
            
            <Form form={form} onFinish={handleUpdate} layout="vertical">
              <Form.Item name="username" label="Username">
                <Input />
              </Form.Item>
              <Form.Item name="birthday" label="Birthday">
                <DatePicker />
              </Form.Item>
              <Button type="primary" htmlType="submit">Update Profile</Button>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
