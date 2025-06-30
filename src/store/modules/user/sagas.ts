import { takeLatest, call, put, all } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { AxiosResponse } from 'axios'

import api from '../../../services/api'
import { USER_TYPES, UpdateProfileRequestAction, User } from './types'
import { updateProfileSuccess, updateProfileFailure } from './actions'

export function* updateProfile({ payload }: UpdateProfileRequestAction) {
  try {
    const { name, email, ...rest } = payload.data

    const profile = {
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    }

    const response: AxiosResponse<User> = yield call(api.put, 'users', profile)

    toast.success('Perfil atualizado com sucesso!')

    yield put(updateProfileSuccess(response.data))
  } catch (err) {
    toast.error('Houve um erro ao atualizar o Perfil')
    yield put(updateProfileFailure())
  }
}

export default all([
  takeLatest(USER_TYPES.UPDATE_PROFILE_REQUEST, updateProfile),
])
