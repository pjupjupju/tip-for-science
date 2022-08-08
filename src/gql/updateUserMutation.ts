import { gql } from '@apollo/client';

export const UPDATE_USER_MUTATION = gql`
  mutation SignUpMutation(
    $email: String
    $oldPassword: String
    $newPassword: String
    $age: Int
    $gender: String
  ) {
    updateUser(
      email: $email
      oldPassword: $oldPassword
      newPassword: $newPassword
      age: $age
      gender: $gender
    )
  }
`;
