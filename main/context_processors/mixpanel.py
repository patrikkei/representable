#
# Copyright (c) 2019- Representable Team (Theodor Marcu, Lauren Johnston, Somya Arora, Kyle Barnes, Preeti Iyer).
#
# This file is part of Representable
# (see http://representable.org).
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#


def get_user_type(request):
    """
    Adds the user type to the context.
    """
    user = request.user
    user_email = ""
    user_type = "visitor"
    member = False
    moderator = False
    admin = False
    if user.is_authenticated:
        user_email = user.email
        user_type = "user"
        member = user.is_generic_member
        moderator = user.is_generic_moderator
        admin = user.is_generic_admin

    return {
        "user_email": user_email,
        "user_type": user_type,
        "member": member,
        "moderator": moderator,
        "admin": admin,
    }
