-- Function to sync auth.users to public.User
-- This trigger automatically creates a corresponding public.User record
-- whenever a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, "firstName", "lastName", phone, "createdAt", "updatedAt")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    phone = EXCLUDED.phone,
    "updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users that don't have a public.User record
INSERT INTO public."User" (id, email, "firstName", "lastName", phone, "createdAt", "updatedAt")
SELECT
  au.id::text,
  au.email,
  COALESCE(au.raw_user_meta_data->>'firstName', ''),
  COALESCE(au.raw_user_meta_data->>'lastName', ''),
  au.raw_user_meta_data->>'phone',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public."User" pu ON au.id::text = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
