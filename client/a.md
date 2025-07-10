To build a high-performance Next.js application with TypeScript, Tailwind CSS, React Query, React Hook Form, and an entity-repository pattern while optimizing for **Largest Contentful Paint (LCP)**, **Cumulative Layout Shift (CLS)**, and implementing robust **linting practices**, follow these best practices. Below, I outline a comprehensive approach, focusing on performance optimization and code quality.

---

## 1. Project Setup
Start with a Next.js project configured with TypeScript and Tailwind CSS:

```bash
npx create-next-app@latest my-app --typescript
cd my-app
npm install -D tailwindcss postcss autoprefixer eslint-plugin-tailwindcss prettier prettier-plugin-tailwindcss
npx tailwindcss init -p
```

### Tailwind CSS Configuration
- Update `tailwind.config.js` to purge unused styles for production, reducing CSS bundle size:
  ```javascript
  module.exports = {
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
  };
  ```
- In `styles/globals.css`, add Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Import `globals.css` in `app/layout.tsx`:
  ```tsx
  import './globals.css';
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  ```

### Install React Query and React Hook Form
```bash
npm install @tanstack/react-query react-hook-form
```

---

## 2. Entity-Repository Pattern
The entity-repository pattern organizes data access logic, promoting separation of concerns and testability.

### Entity
Entities represent core data models, typically defined as TypeScript interfaces or classes.

```tsx
// entities/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### Repository
Repositories encapsulate data access logic (e.g., API calls, database queries).

```tsx
// repositories/userRepository.ts
import { User } from '@/entities/user';

export class UserRepository {
  async getUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
}

export const userRepository = new UserRepository();
```

### Integration with React Query
Use React Query to manage server-state and integrate with the repository pattern.

```tsx
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userRepository } from '@/repositories/userRepository';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userRepository.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => userRepository.getUser(id),
  });
}
```

### Usage in Components
```tsx
// components/UserList.tsx
import { useUsers } from '@/hooks/useUsers';

export default function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

This pattern keeps data-fetching logic centralized, reusable, and decoupled from components.

---

## 3. Optimizing for LCP (Largest Contentful Paint)
LCP measures the time to render the largest content element (e.g., image, text block) in the viewport. Aim for **LCP < 2.5s**.

### Best Practices
1. **Server-Side Rendering (SSR) or Static Site Generation (SSG)**:
   - Use Next.js's `getStaticProps` or `getServerSideProps` to pre-render pages, reducing client-side rendering time.
   - Example with SSG:
     ```tsx
     // pages/users.tsx
     import { userRepository } from '@/repositories/userRepository';

     export async function getStaticProps() {
       const users = await userRepository.getUsers();
       return { props: { users } };
     }

     export default function Users({ users }: { users: User[] }) {
       return (
         <ul>
           {users.map((user) => (
             <li key={user.id}>{user.name}</li>
           ))}
         </ul>
       );
     }
     ```

2. **Optimize Images**:
   - Use Next.js's `<Image>` component with `priority` for above-the-fold images to improve LCP:
     ```tsx
     import Image from 'next/image';

     export default function Hero() {
       return (
         <Image
           src="/hero.jpg"
           alt="Hero image"
           width={1200}
           height={600}
           priority
           sizes="100vw"
           className="w-full"
         />
       );
     }
     ```
   - Serve images in modern formats (e.g., WebP) via a CDN.

3. **Minimize Render-Blocking Resources**:
   - Tailwind CSS is lean, but purge unused styles to reduce CSS size (configured above).
   - Use dynamic imports for heavy components:
     ```tsx
     import dynamic from 'next/dynamic';
     const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), { ssr: false });
     ```

4. **Font Optimization**:
   - Use `next/font` to optimize font loading and prevent layout shifts:
     ```tsx
     // app/layout.tsx
     import { Inter } from 'next/font/google';

     const inter = Inter({ subsets: ['latin'] });

     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="en" className={inter.className}>
           <body>{children}</body>
         </html>
       );
     }
     ```

5. **React Query Optimization**:
   - Use `initialData` to provide pre-fetched data from `getStaticProps` or `getServerSideProps`:
     ```tsx
     export async function getStaticProps() {
       const users = await userRepository.getUsers();
       return { props: { initialUsers: users } };
     }

     export default function Users({ initialUsers }: { initialUsers: User[] }) {
       const { data } = useUsers({ initialData: initialUsers });
       return (
         <ul>
           {data.map((user) => (
             <li key={user.id}>{user.name}</li>
           ))}
         </ul>
       );
     }
     ```

---

## 4. Optimizing for CLS (Cumulative Layout Shift)
CLS measures unexpected layout shifts during page load. Aim for **CLS < 0.1**.

### Best Practices
1. **Set Explicit Dimensions for Images and Videos**:
   - Always specify `width` and `height` for `<Image>` components to reserve space and prevent shifts.
   - Example:
     ```tsx
     <Image src="/example.jpg" alt="Example" width={800} height={400} />
     ```

2. **Avoid Dynamic Content Injection**:
   - Use placeholders or skeletons while data is loading with React Query:
     ```tsx
     export default function UserList() {
       const { data, isLoading } = useUsers();
       if (isLoading)
         return (
           <div className="animate-pulse">
             <div className="h-6 bg-gray-200 rounded mb-2"></div>
             <div className="h-6 bg-gray-200 rounded mb-2"></div>
           </div>
         );
       return (
         <ul>
           {data?.map((user) => (
             <li key={user.id}>{user.name}</li>
           ))}
         </ul>
       );
     }
     ```

3. **Use Tailwind CSS Responsibly**:
   - Avoid excessive use of `min-h-screen` or similar classes that can cause reflows on dynamic content.
   - Use fixed or reserved heights for containers:
     ```tsx
     <div className="h-[400px] w-full overflow-auto">
       {/* Content */}
     </div>
     ```

4. **Font Loading Strategy**:
   - Use `next/font` (as shown above) to preconnect and preload fonts, avoiding FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text).

5. **Dynamic Class Management**:
   - Use `clsx` and `tailwind-merge` to manage conditional Tailwind classes and avoid conflicts that could cause layout shifts:
     ```tsx
     // components/Button.tsx
     import clsx from 'clsx';
     import { twMerge } from 'tailwind-merge';

     type ButtonProps = { primary?: boolean; disabled?: boolean } & React.HTMLAttributes<HTMLButtonElement>;

     export const Button: React.FC<ButtonProps> = ({ primary, disabled, className, ...props }) => {
       const classes = twMerge(
         clsx(
           'px-4 py-2 rounded transition-colors',
           {
             'bg-blue-500 hover:bg-blue-600 text-white': primary && !disabled,
             'bg-gray-300 text-gray-600': !primary && !disabled,
             'bg-gray-200 text-gray-400 pointer-events-none': disabled,
           },
           className
         )
       );
       return <button className={classes} disabled={disabled} {...props}>Click me</button>;
     };
     ```

---

## 5. React Hook Form Integration
React Hook Form minimizes re-renders, improving performance for form-heavy applications.

### Example Form
```tsx
// components/UserForm.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { userRepository } from '@/repositories/userRepository';
import { useMutation } from '@tanstack/react-query';

type UserFormInputs = {
  name: string;
  email: string;
};

export default function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormInputs>();
  const mutation = useMutation({
    mutationFn: (data: UserFormInputs) => userRepository.createUser(data),
  });

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="border p-2 w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          id="email"
          {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
          className="border p-2 w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
```

### Performance Tips
- Use `useForm` with `defaultValues` to avoid unnecessary re-renders.
- Leverage `watch` sparingly, as it can cause re-renders on every input change.
- Combine with React Query's `useMutation` for efficient form submissions.

---

## 6. Linting Practices
Robust linting ensures code quality and consistency, especially in TypeScript-heavy projects.

### ESLint and Prettier Setup
1. Install dependencies:
   ```bash
   npm install -D eslint eslint-config-next eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier prettier-plugin-tailwindcss
   ```

2. Create `.eslintrc.js`:
   ```javascript
   module.exports = {
     root: true,
     env: { browser: true, es2021: true, node: true },
     parser: '@typescript-eslint/parser',
     parserOptions: { ecmaVersion: 2021, sourceType: 'module', ecmaFeatures: { jsx: true } },
     extends: [
       'next/core-web-vitals',
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'plugin:react/recommended',
       'plugin:react-hooks/recommended',
       'plugin:prettier/recommended',
       'plugin:tailwindcss/recommended',
     ],
     plugins: ['react', '@typescript-eslint', 'prettier', 'tailwindcss'],
     rules: {
       'prettier/prettier': 'warn',
       'react/react-in-jsx-scope': 'off',
       'react/prop-types': 'off',
       '@typescript-eslint/explicit-module-boundary-types': 'off',
       'tailwindcss/classnames-order': 'warn',
     },
     settings: { react: { version: 'detect' } },
   };
   ```

3. Create `.prettierrc.js`:
   ```javascript
   module.exports = {
     semi: true,
     trailingComma: 'all',
     singleQuote: true,
     printWidth: 100,
     tabWidth: 2,
     plugins: ['prettier-plugin-tailwindcss'],
   };
   ```

4. Add `.eslintignore`:
   ```
   node_modules
   .next
   dist
   build
   ```

### Husky and Lint-Staged
Automate linting and formatting on commit:
```bash
npm install -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

Create `.lintstagedrc`:
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css}": ["stylelint --fix", "prettier --write"]
}
```

### Additional Linting Tips
- Use `eslint-plugin-tailwindcss` to enforce Tailwind best practices, like class order.
- Run `next lint` to catch Next.js-specific issues.
- Integrate with VSCode using ESLint and Prettier extensions for real-time feedback.

---

## 7. Additional Performance Tips
- **Code Splitting**: Use Next.js dynamic imports and React Query's lazy loading to reduce initial bundle size.
- **Tree Shaking**: Ensure unused code is removed by using ES modules and tools like `esbuild`.
- **Analyze Bundle**: Use `@next/bundle-analyzer` to identify large dependencies:
  ```bash
  npm install -D @next/bundle-analyzer
  ```
  Update `next.config.js`:
  ```javascript
  const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
  module.exports = withBundleAnalyzer({});
  ```
  Run `ANALYZE=true npm run build`.

- **Caching**: Leverage React Query's caching to minimize API calls:
  ```tsx
  useQuery({
    queryKey: ['users'],
    queryFn: () => userRepository.getUsers(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  ```

---

## 8. Testing
Add Jest and React Testing Library for testing:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Configure Jest in `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

Test example:
```tsx
// components/__tests__/UserList.test.tsx
import { render, screen } from '@testing-library/react';
import UserList from '../UserList';
import { useUsers } from '@/hooks/useUsers';

jest.mock('@/hooks/useUsers');

test('renders user list', () => {
  (useUsers as jest.Mock).mockReturnValue({
    data: [{ id: '1', name: 'John' }],
    isLoading: false,
    error: null,
  });

  render(<UserList />);
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

---

## 9. Summary
- **Entity-Repository Pattern**: Centralize data access for maintainability.
- **LCP**: Use SSG/SSR, optimize images with `<Image>`, and minimize render-blocking resources.
- **CLS**: Set explicit dimensions, use skeletons, and manage dynamic classes with `clsx`/`tailwind-merge`.
- **React Query**: Cache data and integrate with repositories for efficient data fetching.
- **React Hook Form**: Minimize re-renders with efficient form handling.
- **Linting**: Use ESLint, Prettier, and `eslint-plugin-tailwindcss` with Husky and lint-staged for code quality.
- **Testing**: Add Jest and React Testing Library to ensure reliability.

By following these practices, you’ll build a performant, maintainable, and scalable Next.js application with optimal LCP and CLS scores and robust linting. For further details, refer to the Next.js documentation or Tailwind CSS guides.[](https://nextjs.org/docs/app/guides/tailwind-css)[](https://dev.to/jsdevspace/setup-nextjs-14-project-with-eslint-prettier-tailwind-css-226j)[](https://www.getfishtank.com/insights/optimizing-tailwind-css-in-next-js-efficient-dynamic-class-management)